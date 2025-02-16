import { CHAIN_LIST } from '../constants'

export const normalizeChainName = (
    fetchedChainName: string
): { chainId: number | null; chainName: string | null } => {
    const chain = CHAIN_LIST.find(
        (each) => each.fetchedChainName === fetchedChainName
    )
    return chain
        ? { chainId: chain.chainId, chainName: chain.chainName }
        : { chainId: null, chainName: fetchedChainName }
}
