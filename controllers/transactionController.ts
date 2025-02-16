import { Request, Response } from 'express'
import { getTokenTransactionByTokenIdService } from '../services/transactionService'
import { logger } from '../utils/logger'

// Controller to fetch transaction data for a specific token
export const getTokenTransactionByTokenId = async (
    req: Request,
    res: Response
) => {
    logger.info(
        `Received request to get transaction data for token: ${req.method} ${req.url}`
    )

    try {
        const { tokenId } = req.params

        if (!tokenId) {
            logger.warn('Token ID not provided')
            return res.status(400).json({
                status: 'error',
                message: 'Token ID is required',
                data: null,
            })
        }

        logger.info(`Fetching transaction data for token with ID: ${tokenId}`)
        const transactionData =
            await getTokenTransactionByTokenIdService(tokenId)

        if (!transactionData) {
            logger.warn(`Transaction data not found for token ID: ${tokenId}`)
            return res.status(404).json({
                status: 'error',
                message: 'Transaction data not found',
                data: null,
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Transaction data fetched successfully',
            data: transactionData,
        })
    } catch (error) {
        logger.error(`Error fetching transaction data for token ID: ${error}`)
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            data: null,
        })
    }
}
