import mongoose from 'mongoose'
import { logger } from '../utils/logger'
import env from './env'

export const connectToDatabase = async () => {
    try {
        mongoose.connection.on('connected', () => {
            logger.info('Connection to Database established')
        })
        mongoose.connection.on('error', (error) => {
            logger.error(`Error: ${error.message}`)
        })
        await mongoose.connect(env.MONGODB_URI)
    } catch (error) {
        logger.error(`Error: ${error}`)
        process.exit(1)
    }
}
