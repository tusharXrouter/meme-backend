import { Document, Schema, model } from 'mongoose'

export interface IToken extends Document {
    cg_id: string
    name: string
    symbol: string
    market_cap: number
    fdv: number
    logo_url: string
    price: number
    change_1h: number
    change_24h: number
    change_7d: number
    change_30d: number
    volume_24h: number
    ath: number
    atl: number
    sentiment_score: {
        score: number
        last_updated: Date
    }
    graph_7d: number[]
    platforms: { chainName: string; address: string; chainId: string }[]
    createdAt: Date
    updatedAt: Date
}

const tokenSchema = new Schema<IToken>(
    {
        cg_id: { type: String, required: true },
        name: { type: String, required: true },
        symbol: { type: String, required: true },
        market_cap: { type: Number, default: 0 },
        fdv: { type: Number, default: 0 },
        logo_url: String,
        price: { type: Number, default: 0 },
        change_1h: { type: Number, default: 0 },
        change_24h: { type: Number, default: 0 },
        change_7d: { type: Number, default: 0 },
        change_30d: { type: Number, default: 0 },
        volume_24h: { type: Number, default: 0 },
        ath: { type: Number, default: 0 },
        atl: { type: Number, default: 0 },
        sentiment_score: {
            score: { type: Number, default: 0 },
            last_updated: Date || null,
        },
        graph_7d: [{ type: Number, default: 0 }],
        platforms: [
            {
                chainName: String,
                address: String,
                chainId: String,
            },
        ],
    },
    { timestamps: true }
)

export const Token = model<IToken>('Token', tokenSchema)
