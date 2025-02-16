import { Transaction } from '../models/Transaction'
import { Schema, Types } from 'mongoose'
import env from '../config/env'
import { HttpError } from '../utils/HttpError'
import { Token } from '../models/Token'

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

// Function to get a specific token by ID
const getTokenById = async (id: string) => {
    try {
        const token = await Token.findById(id)

        if (!token) {
            throw new Error('Token not found')
        }
        return token
    } catch (error) {
        throw error
    }
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
    const url = `${env.BIRDEYE_API_BASE}/defi/txs/token/seek_by_time?address=${tokenAddress}&offset=0&limit=50&tx_type=swap&after_time=${oneHourAgo}`

    try {
        // await new Promise((resolve) => setTimeout(resolve, 200))
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
                    quote: {
                        symbol: t.quote.symbol,
                        address: t.quote.address,
                        amount: t.quote.amount,
                    },
                    base: {
                        symbol: t.base.symbol,
                        address: t.base.address,
                        amount: t.base.amount,
                    },
                    source: t.source,
                    txType: t.txType,
                    basePrice: t.basePrice,
                    quotePrice: t.quotePrice,
                    blockUnixTime: t.blockUnixTime * 1000,
                    owner: t.owner,
                    txHash: t.txHash,
                }))
        )
        // .filter((t: any) => {
        //     const transactionTime = new Date(t.blockUnixTime).getTime() // Convert to timestamp
        //     const oneDayAgo = Date.now() - 86400000 // 24 hours ago
        //     return transactionTime > oneDayAgo
        // })
    } catch (error) {
        throw error
    }
}

export const getTokenTransactionByTokenIdService = async (tokenId: string) => {
    // First try database
    const dbTransactions = await Transaction.findOne({
        token: new Types.ObjectId(tokenId),
    }).catch((error) => {
        console.error(`Database error for token ${tokenId}:`, error.message)
        return null
    })

    if (dbTransactions) return dbTransactions

    // Fallback to API if database returns nothing
    try {
        const token = await getTokenById(tokenId)
        // console.log(token)
        if (token.platforms.length === 0) {
            throw new HttpError(
                'Transaction Data not available at the moment.',
                404
            )
        }
        // console.log(token.platforms)
        const tokenWithValidPlatforms = token.platforms.filter((each) =>
            AVAILABLE_CHAINS.includes(
                each.chainName === 'binance' ? 'bsc' : each.chainName
            )
        )

        // console.log(tokenWithValidPlatforms)
        if (tokenWithValidPlatforms.length === 0) {
            throw new HttpError('Chain Incompatible', 404)
        }

        const tokenAddress = tokenWithValidPlatforms[0].address
        const chainName = tokenWithValidPlatforms[0].chainName

        const apiTransactions = await getTokenTransactionsByTokenAddress(
            tokenAddress,
            chainName
        )
        return {
            token: tokenId,
            chain: chainName,
            transactions: apiTransactions,
        }
    } catch (error) {
        console.error(
            `API failure for token ${tokenId}:`,
            (error as Error).message
        )
        throw new HttpError(
            'Could not retrieve transactions from any source',
            503
        )
    }
}
