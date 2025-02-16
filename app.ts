import express from 'express'
import tokenRoutes from './routes/tokenRoutes'
// import tweetRoutes from "routes/tweetRoutes";
import cors from 'cors'
import transactionRoutes from './routes/transactionRoutes'
import { errorHandler } from './utils/errorHandler'
import { logger } from './utils/logger'

const app = express()

app.use(express.json())

app.use(cors())

app.use((req, res, next) => {
    logger.info(`[${req.method}] ${req.url}`)
    next()
})

app.get('/health', (req, res, next) => {
    return res.send({
        status: 'ok',
        message: 'Server is running',
    })
})

// Set up routes
app.use('/api', tokenRoutes)
// app.use("/api", tweetRoutes);
app.use('/api', transactionRoutes)

// Error handler middleware
app.use(errorHandler)

export default app
