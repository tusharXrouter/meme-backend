import { Schema, model } from 'mongoose'

interface ITransaction {
    token: Schema.Types.ObjectId
    chain: string
    transactions: {
        blockUnixTime: Date
        source: string
        txType: string
        from: {
            symbol: string
            address: string
            amount: string
            price: string
        }
        to: {
            symbol: string
            address: string
            amount: string
            price: string
        }
        txHash: string
        owner: string
    }[]
}

const transactionSchema = new Schema<ITransaction>(
    {
        token: {
            type: Schema.Types.ObjectId,
            ref: 'Token',
            required: true,
        },
        chain: {
            type: String,
            required: true,
        },
        transactions: [
            {
                blockUnixTime: {
                    type: Date,
                    required: true,
                },
                source: {
                    type: String,
                    required: true,
                },
                txType: {
                    type: String,
                    required: true,
                },
                txHash: {
                    type: String,
                    required: true,
                },
                from: {
                    symbol: String,
                    address: String,
                    amount: String,
                    price: String,
                },

                to: {
                    symbol: String,
                    address: String,
                    amount: String,
                    price: String,
                },
                owner: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
)

export const Transaction = model<ITransaction>('Transaction', transactionSchema)
