import { Request, Response } from 'express'
import { logger } from '../utils/logger'
import {
    getTokenByIdService,
    getAllTokensService,
} from '../services/tokenService'
import { Token } from '../models/Token'

// Controller to get a single token
export const getTokenById = async (req: Request, res: Response) => {
    logger.info(`Received request to get token by ID: ${req.method} ${req.url}`)

    try {
        const { id } = req.params

        if (!id) {
            logger.warn('Token ID not provided')
            return res.status(400).json({
                status: 'error',
                message: 'Token ID is required',
                data: null,
            })
        }

        logger.info(`Fetching token with ID: ${id}`)
        const token = await getTokenByIdService(id)

        if (!token) {
            logger.warn(`Token not found with ID: ${id}`)
            return res.status(404).json({
                status: 'error',
                message: 'Token not found',
                data: null,
            })
        }

        return res.status(200).json({
            status: 'success',
            message: 'Token fetched successfully',
            data: token,
        })
    } catch (error) {
        logger.error(`Error fetching token by ID: ${error}`)
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: (error as Error).message,
        })
    }
}

// Controller to get all tokens
export const getAllTokens = async (req: Request, res: Response) => {
    logger.info(`Received request to get tokens: ${req.method} ${req.url}`)

    try {
        const { per_page = '10', page = '1', order = 'change_24h_desc', chain } = req.query;

        const parsedPage = parseInt(page as string, 10);
        const parsedPerPage = parseInt(per_page as string, 10);

        if (parsedPage <= 0 || parsedPerPage <= 0) {
            logger.warn('Invalid pagination parameters');
            return res.status(400).json({
                status: 'error',
                message: 'Page and per_page must be positive integers',
                data: null,
            });
        }

        // Ensure chain is treated as a string or undefined
        const chainString = typeof chain === 'string' ? chain : undefined;

        logger.info('Fetching tokens with pagination and sorting');
        const tokens = await getAllTokensService(
            parsedPage,
            parsedPerPage,
            order as string,
            chainString
        );

        if (!tokens || tokens.length === 0) {
            logger.warn('No tokens found');
            return res.status(404).json({
                status: 'error',
                message: 'No tokens found',
                data: [],
            });
        }

        const totalTokens = await Token.countDocuments();

        return res.status(200).json({
            status: 'success',
            message: 'Tokens fetched successfully',
            data: tokens,
            pagination: {
                page: parsedPage,
                per_page: parsedPerPage,
                total: totalTokens,
            },
        });
    } catch (error) {
        logger.error(`Error fetching tokens: ${error}`);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: (error as Error).message,
        });
    }
};