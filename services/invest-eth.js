// Invest the specified ether amount
const addLiquidityToBancor = require('../external/bancor/invest').addLiquidity

module.exports =  async function investEth(amountInEth) {

    const txnHash = await addLiquidityToBancor(amountInEth.toString())

    return {txnHash}

}