import { NextFunction, Request, Response } from 'express'
import { HttpError } from './HttpError'
import { logger } from './logger'

export const errorHandler = (
    err: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(err.message)

    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ message: err.message })
    }

    res.status(500).json({ error: 'Internal Server Error' })
}
