// Invest the specified ether amount
const addLiquidityUniswap = require('../external/uniswap/invest').addLiquidity
const flanDeposit = require('./flan-deposit')

module.exports =  async function investEth() {

    const [uniswapTxHash, anchorDeposit] = await Promise.all([addLiquidityUniswap(), flanDeposit()])

    console.log("Anchor Deposit")
    console.log(anchorDeposit)

    return {
        investments: [
            {
                protocol: "anchor",
                txDetails: anchorDeposit
            },
            {
                protocol: "uniswap",
                txHash: uniswapTxHash
            }
        ]
    }

}


