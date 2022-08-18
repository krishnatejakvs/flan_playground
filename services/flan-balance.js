// Get the balance in Anchor against flan account
const anchorEarn = require('../external/anchor')();
const { DENOMS } = require('@anchor-protocol/anchor-earn')

module.exports =  async function flanBalance() {
    // IMPLEMENT THE LOGIC to get flan balance here

    const userBalance = await anchorEarn.balance({
        currencies: [DENOMS.UST],
        log: (data) => {
            console.log(data);
          },
    });

    return userBalance;
}