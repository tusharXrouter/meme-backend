import { Schema, model } from 'mongoose'

interface ITokenCategory {
    id: string
    name: string
    market_cap?: number
    createdAt: Date
    updatedAt: Date
}

const categorySchema = new Schema<ITokenCategory>(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        market_cap: Number,
    },
    { timestamps: true }
)

export const Category = model('Category', categorySchema)
