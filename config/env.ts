import dotenv from 'dotenv'
dotenv.config()

interface EnvConfig {
    PORT: number
    MONGODB_URI: string
    LOG: boolean
    BIRDEYE_API_KEY: string
    COINGECKO_API_KEY: string
    COINGECKO_API_BASE: string
    BIRDEYE_API_BASE: string
    BIRDEYE_WS_URL: string
}

const requiredEnvVariables = [
    'MONGODB_URI',
    'BIRDEYE_API_KEY',
    'COINGECKO_API_KEY',
    'COINGECKO_API_BASE',
    'BIRDEYE_API_BASE',
    'BIRDEYE_WS_URL',
]

// Validate required environment variables
requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`)
    }
})

// Export environment variables as a typed object
const env: EnvConfig = {
    PORT: parseInt(process.env.PORT || '8080', 10),
    MONGODB_URI: process.env.MONGODB_URI || '',
    LOG: process.env.LOG === 'true',
    BIRDEYE_API_KEY: process.env.BIRDEYE_API_KEY || '',
    COINGECKO_API_KEY: process.env.COINGECKO_API_KEY || '',
    COINGECKO_API_BASE: process.env.COINGECKO_API_BASE || '',
    BIRDEYE_API_BASE: process.env.BIRDEYE_API_BASE || '',
    BIRDEYE_WS_URL: process.env.BIRDEYE_WS_URL || '',
}

export default env
