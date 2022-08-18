// Withdraw UST from anchor to flan account
const anchorEarn = require('../external/anchor')();
const { DENOMS } = require('@anchor-protocol/anchor-earn')

module.exports =  async function flanWithdraw () {
    // TODO: Change the function signature to accept the withdraw amount
    const deposit = await anchorEarn.withdraw({
        amount: '20', // amount in natural decimal e.g. 100.5. The amount will be handled in macro.
        currency: DENOMS.UST,
        log: (data) => {
            console.log(data);
          },
    });
    return deposit
}