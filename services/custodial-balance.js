// Gets the balance based on userID

var accountDB = require('../db/account')

var exchange = require('../domain/exchange')
var custodialSync = require('./custodial-sync')

/**
 * 
 * @param {*} userId 
 * @returns 
 */
function getAddress(userId) {
    // We are supposed to fetch the custodial wallet address of the user.
    // For now, we are using the flan address.
    return process.env.FLAN_ADDRESS
}

// Get the balances for an account
module.exports =  async function userBalances(userId) {

    const userAddress = getAddress(userId)
    await custodialSync(userAddress)

    const balanceInFT = await accountDB.balance(userAddress);

    const time = new Date();
    const balance = exchange.fromFT(balanceInFT, 'UST', time);

    console.log(`computed balance: ${balance}`)
    return {
        balance: balance.toFixed(3),
        currency: 'UST',
        computedAt: time
    }
}