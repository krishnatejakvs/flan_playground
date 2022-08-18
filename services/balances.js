var accountDB = require('../db/account')

var exchange = require('../domain/exchange')

// Get the balances for an account
module.exports =  async function balances(address) {

    const balanceInFT = await accountDB.balance(address);

    const time = new Date();
    const balance = exchange.fromFT(balanceInFT, 'UST', time);

    console.log(`computed balance: ${balance}`)
    return {
        balance: balance,
        computedAt: time
    }
}