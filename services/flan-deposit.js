// Deposit UST into Anchor from flan account
const anchorEarn = require('../external/anchor')();
const { DENOMS } = require('@anchor-protocol/anchor-earn')

module.exports =  async function flanDeposit () {
    // TODO: Get the wallet balance for the flan account

    const deposit = await anchorEarn.deposit({
        // TODO: Change the amount to the (wallet balance of flan - some buffer)
        amount: '20', // amount in natural decimal e.g. 100.5. The amount will be handled in macro.
        currency: DENOMS.UST,
        log: (data) => {
            console.log(data);
          },
    });

    return JSON.parse(deposit.toJSON());
}