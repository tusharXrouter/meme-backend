import env from '../config/env'
import { Token } from '../models/Token'
import { Category } from '../models/TokenCategory'
import cron from 'node-cron'

import { logger } from '../utils/logger'

export const getTokenCategories = () => {
    cron.schedule('0 0 * * 0', async () => {
        try {
            logger.info('Cron Job: Fetching categories from CoinGecko...')
            const url = `${env.COINGECKO_API_BASE}/coins/categories`

            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'x-cg-demo-api-key': env.COINGECKO_API_KEY,
                },
            }
            const { data: categories } = await axios.get(url, options)

            if (!Array.isArray(categories) || categories.length === 0) {
                logger.warn('Cron Job: No categories found.')
                return
            }

            await Token.deleteMany({})

            const savedCategories = await Category.insertMany(categories)

            logger.info(
                `Cron Job: Successfully saved ${savedCategories.length} categories to Database`
            )
        } catch (error) {
            logger.error(
                `Cron Job: Error in fetching meme coins: ${(error as any).message}`
            )
        }
    })
}
