// Sync deposits and withdrawals of a particular account

var accountDB = require('../db/account')

var exchange = require('../domain/exchange')
const figment = require('../external/figment');
const { DENOMS } = require('@anchor-protocol/anchor-earn')

module.exports =  async function flanSync (sender) {

    await accountDB.start(sender)
    const deposits = await figment.getDepositHistory(sender)

    await Promise.all(
        deposits.map(deposit => processDeposit(deposit, sender))
    )

    const withdrawals = await figment.getWithdrawalHistory(sender);

    withdrawals.forEach(async withdrawal => {
        await processWithdrawals(withdrawal, sender)
    })
}


async function processDeposit(deposit, sender) {
        /**
         * Each deposit is of the form
         *  {
         *      amount: amount, // string
         *      currency: currency,
         *      time: new Date(tx.timestamp)
         *  }
     */
    const amount = parseInt(deposit.amount) /(10**6)
    const amountInFT = exchange.toFT(amount, 'UST', deposit.time);

    await accountDB.credit(sender, amountInFT)
}

async function processWithdrawals(withdrawal, sender) {
    /**
     * Each withdrawal is of the form
     *  {
     *      amount: amount, // string
     *      currency: currency,
     *      time: new Date(tx.timestamp)
     *  }
 */
const amount = parseInt(withdrawal.amount) /(10**6)
// Compute FT at the time of withdrawal.
// This computation may not be accurate as we do not use withdrawal.time
// during actual withdrawal. The time we use is the time of withdraw request.
const amountInFT = exchange.toFT(amount, 'UST', withdrawal.time);

await accountDB.debit(sender, amountInFT)
}