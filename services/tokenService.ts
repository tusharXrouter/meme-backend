import { Token } from '../models/Token'

// Function to get a specific token by ID
export const getTokenByIdService = async (id: string) => {
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

export const getAllTokensService = async (
    page: number,
    per_page: number,
    order: string
) => {
    const skip = (page - 1) * per_page

    // Define the sorting options
    const sortOptions: { [key: string]: any } = {
        market_cap_desc: { market_cap: -1 },
        market_cap_asc: { market_cap: 1 },
        price_desc: { price: -1 },
        price_asc: { price: 1 },
        volume_desc: { volume_24h: -1 },
        volume_asc: { volume_24h: 1 },
        change_24h_asc: { change_24h: 1 },
        change_24h_desc: { change_24h: -1 },
    }

    // Fetch the tokens with pagination and sorting
    const tokens = await Token.find()
        .sort(sortOptions[order])
        .skip(skip)
        .limit(per_page)

    // Return empty array if no tokens are found
    return tokens || []
}
