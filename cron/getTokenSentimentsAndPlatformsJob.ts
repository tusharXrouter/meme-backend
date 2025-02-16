import cron from 'node-cron'
import { logger } from '../utils/logger'
import env from '../config/env'
import { Token } from '../models/Token'
import axios from 'axios'
import { normalizeChainName } from '../utils/normalizeChainName'

const getTokensSentimentAndPlatforms = async (coinId: string) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': env.COINGECKO_API_KEY,
        },
    }

    try {
        const response = await axios.get(
            `${env.COINGECKO_API_BASE}/coins/${coinId}`,
            options
        )
        const data = response.data as any
        const sentimentUp = data.sentiment_votes_up_percentage || 0
        const sentimentDown = data.sentiment_votes_down_percentage || 0
        const total = sentimentUp + sentimentDown
        const goodness =
            total === 0 ? 50 : Math.round((sentimentUp / total) * 100)
        return {
            score: goodness.toFixed(2),
            platforms: Object.entries(data.platforms || {})
                .map(([chainName, address]) => {
                    const { chainId, chainName: normalizedChainName } =
                        normalizeChainName(chainName)
                    return {
                        chainId,
                        chainName: normalizedChainName || chainName, // Fallback to original if null
                        address,
                    }
                })
                .filter((p) => p.address), // Remove empty addresses
        }
    } catch (error) {
        throw error
    }
}

async function updateTokensSentimentAndPlatforms() {
    const tokens = await Token.find({
        // if sentiment or platform does not exist or last update time was before 1 hour.
        $or: [
            {
                $or: [
                    {
                        sentiment_score: { $exists: false },
                    },
                    {
                        'sentiment_score.last_updated': {
                            $lte: new Date(Date.now() - 3600000),
                        },
                    },
                ],
            },
            {
                $or: [
                    { platforms: { $exists: false } },
                    { platforms: { $size: 0 } },
                ],
            },
        ],
    })

    if (!tokens.length) {
        return
    }
    for (const token of tokens) {
        await new Promise((resolve) => setTimeout(resolve, 3000))
        const { score, platforms } = await getTokensSentimentAndPlatforms(
            token.cg_id
        )

        await Token.findByIdAndUpdate(token._id, {
            sentiment_score: {
                score,
                last_updated: new Date(),
            },
            platforms,
        })
    }
}

const getAllTokensSentimentAndPlatformsJob = () => {
    // every 5 hours.
    cron.schedule('0 */5 * * *', async () => {
        // // every 3 sec.
        // cron.schedule('*/3 * * * * *', async () => {
        try {
            logger.info('Cron Job: Starting sentiment update for tokens...')
            await updateTokensSentimentAndPlatforms()
            logger.info(
                'Cron Job: Successfully updated sentiment scores for all tokens'
            )
        } catch (error) {
            logger.error(`Cron Job: Error in updating sentiments: ${error}`)
        }
    })
}

export default getAllTokensSentimentAndPlatformsJob
