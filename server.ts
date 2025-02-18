import { connectToDatabase } from './config/db'
import {
    getTokenJob,
    getAllTokensSentimentAndPlatformsJob,
    getTransactionsJob,
} from './cron'
import app from './app'
import env from './config/env'
import { logger } from './utils/logger'

const startServer = async () => {
    await connectToDatabase()
    const PORT = env.PORT || 8000
    app.listen(PORT, async () => {
        logger.info(`Server is running on port ${PORT}`)
        // getTokenJob()
        // getAllTokensSentimentAndPlatformsJob()
        // getTransactionsJob() 
    })
}

startServer()
