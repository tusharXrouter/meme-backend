import { IToken, Token } from '../models/Token'
import env from '../config/env'
import cron from 'node-cron'
import { logger } from '../utils/logger'
import mongoose, { set } from 'mongoose'
import { Transaction } from '../models/Transaction'
import { HttpError } from '../utils/HttpError'

const AVAILABLE_CHAINS = [
    'solana',
    'ethereum',
    'arbitrum',
    'avalanche',
    'bsc',
    'optimism',
    'polygon',
    'base',
    'zksync',
    'sui',
]
const getTopTokenIds = async (order: string) => {
    // Define the sorting options
    const sortOptions: { [key: string]: any } = {
        market_cap_desc: { market_cap: -1 },
        market_cap_asc: { market_cap: 1 },
        price_desc: { price: -1 },
        price_asc: { price: 1 },
        volume_desc: { volume_24h: -1 },
        volume_asc: { volume_24h: 1 },
        change_24h_asc: { change_24h: 1 },
        change_24h_desc: { change_24h: -1 },
    }

    const tokenIds = (
        await Token.find().sort(sortOptions[order]).limit(20)
    ).map((t) => t._id)
    // console.log(tokenIds)

    return tokenIds || []
}


const getTopUniqueTokenIds = async () => {
    const [marketCap, price, volume, change] = await Promise.all([
        getTopTokenIds('market_cap_desc'),
        getTopTokenIds('price_desc'),
        getTopTokenIds('volume_desc'),
        getTopTokenIds('change_24h_desc'),
    ])

    const uniqueTokens = new Set<string>()

    // Combine all tokens and add to Set for automatic deduplication
    const allTokens = [...marketCap, ...price, ...volume, ...change]
    for (const token of allTokens) {
        uniqueTokens.add(token._id.toString())
    }
    // console.log(uniqueTokens)
    return Array.from(uniqueTokens)
}

export const getTopTokens = async () => {
    const ids = await getTopUniqueTokenIds()
    // Convert string IDs to ObjectId with validation
    const objectIds = ids
        .map((id) => {
            try {
                return new mongoose.Types.ObjectId(id)
            } catch (error) {
                console.warn(`Invalid ID format: ${id}`)
                return null
            }
        })
        .filter((id): id is mongoose.Types.ObjectId => id !== null)

    if (objectIds.length === 0) {
        console.log('No valid IDs provided')
        return []
    }

    const tokens = await Token.find(
        {
            _id: { $in: objectIds },
        },
        { _v: 0 }
    )
        .lean()
        .exec()

    return tokens
        .map((token) => {
            const filteredPlatforms =
                token.platforms
                    ?.filter((p) => {
                        const chain =
                            p.chainName === 'binance' ? 'bsc' : p.chainName
                        return AVAILABLE_CHAINS.includes(chain)
                    })
                    .map((token) => ({
                        ...token,
                        chainName:
                            token.chainName === 'binance'
                                ? 'bsc'
                                : token.chainName,
                    })) || []

            return filteredPlatforms.length > 0
                ? { ...token, platforms: filteredPlatforms }
                : null
        })
        .filter((token) => token !== null)
}

const getTokenTransactionsByTokenAddress = async (
    tokenAddress: string,
    chainName: string
) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'X-API-KEY': env.BIRDEYE_API_KEY,
            'x-chain': chainName,
        },
    }

    const oneHourAgo = Math.floor(Date.now() / 1000) - 3600
    const url = `${env.BIRDEYE_API_BASE}/defi/txs/token/seek_by_time?address=${tokenAddress}&offset=0&limit=50&tx_type=swap&after_time=${oneHourAgo}&sort_type=asc`
  
    try {
        await new Promise((resolve) => setTimeout(resolve, 200))
        const response = await fetch(url, options)
        const data = await response.json()

        if (!response.ok) {
            throw new HttpError(data.messsage, response.status)
        }
        // return data
        return (
            data.data.items
                // .sort((a: any, b: any) => a.blockUnixTime - b.blockUnixTime)
                .map((t: any) => ({
                    from: {
                        symbol: t.from.symbol,
                        address: t.from.address,
                        amount: t.from.uiAmount,
                        price: t.from.price ?? t.from.nearestPrice,
                    },
                    to: {
                        symbol: t.to.symbol,
                        address: t.to.address,
                        amount: t.to.uiAmount,
                        price: t.to.price ??  t.to.nearestPrice,
                    },
                    source: t.source,
                    txType: t.side ?? t.tx_type,
                    blockUnixTime: t.blockUnixTime * 1000,
                    owner: t.owner,
                    txHash: t.txHash,
                }))
        )
    } catch (error) {
        throw error
    }
}

export const getTransactionsJob = () => {
    // Every 10 seconds
    cron.schedule('*/10 * * * * *', async () => {
        try {
            logger.info('Cron Job: Getting transactions for top tokens...')
            const topTokens = await getTopTokens()
            // console.log(topTokens.map((t) => t.symbol))

            for (const token of topTokens) {
                try {
                    const transactions =
                        await getTokenTransactionsByTokenAddress(
                            token.platforms[0].address,
                            token.platforms[0].chainName
                        )

                    await Transaction.findOneAndUpdate(
                        {
                            token: token._id,
                            chain: token.platforms[0].chainName,
                        },
                        {
                            $set: {
                                transactions: transactions,
                            },
                        },
                        { upsert: true, new: true }
                    )
                } catch (error) {
                    logger.error(
                        `Failed to process token ${token._id}: ${error}`
                    )
                }
            }

            logger.info(
                'Cron Job: Successfully saved transactions of top tokens'
            )
        } catch (error: any) {
            logger.error(
                `Cron Job: Error in getting the transactions: ${error}`
            )
        }
    })
}
