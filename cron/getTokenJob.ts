import cron from 'node-cron'
import { logger } from '../utils/logger'
import { Token } from '../models/Token'
import env from '../config/env'
import axios from 'axios'

const getTokensByCategory = async (order: string) => {
    const params = new URLSearchParams({
        vs_currency: 'usd',
        category: 'meme-token',
        order,
        per_page: '250',
        page: '1',
        sparkline: 'true',
        price_change_percentage: '1h,24h,7d,30d',
    })

    const url = `${env.COINGECKO_API_BASE}/coins/markets?${params.toString()}`

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': env.COINGECKO_API_KEY,
        },
    }

    try {
        const response = await axios.get(url, options)
        return response.data
    } catch (error) {
        throw error
    }
}

const saveTokensToDatabase = async (topTokens: any[]) => {
    const tokenIds = topTokens.map((token) => token.id)

    // Delete tokens that are not in topTokens
    await Token.deleteMany({ cg_id: { $nin: tokenIds } })

    for (const token of topTokens) {
        await Token.updateOne(
            { cg_id: token.id }, // Find by Coingecko ID
            {
                $set: {
                    name: token.name,
                    symbol: token.symbol,
                    market_cap: token.market_cap,
                    fdv: token.fully_diluted_valuation,
                    logo_url: token.image,
                    price: token.current_price,
                    volume_24h: token.total_volume,
                    ath: token.ath,
                    atl: token.atl,
                    graph_7d: token.sparkline_in_7d?.price,
                    change_1h: token.price_change_percentage_1h_in_currency,
                    change_24h: token.price_change_percentage_24h_in_currency,
                    change_7d: token.price_change_percentage_7d_in_currency,
                    change_30d: token.price_change_percentage_30d_in_currency,
                },
                $setOnInsert: { cg_id: token.id }, // Ensure cg_id is set on insert
            },
            { upsert: true } // Update if exists, insert if not
        )
    }

    logger.info(`Processed ${topTokens.length} tokens`)
    return topTokens
}

const getTokenJob = () => {
    // every 5 hours.
    cron.schedule('0 */5 * * *', async () => {
        // every 3 sec.
        // cron.schedule('*/3 * * * * *', async () => {
        try {
            logger.info('Cron Job: Fetching tokens from CoinGecko...')
            const topTokens = await getTokensByCategory('market_cap_desc')

            if (!Array.isArray(topTokens) || topTokens.length === 0) {
                logger.warn('Cron Job: No tokens found.')
                return
            }

            const savedTokens = await saveTokensToDatabase(topTokens)
            logger.info(
                `Cron Job: Successfully saved ${savedTokens.length} tokens to Database`
            )
        } catch (error) {
            logger.error(`Cron Job: Error in saving tokens: ${error}`)
        }
    })
}

export default getTokenJob
