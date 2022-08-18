// Sync deposits and withdrawals of a particular custodial wallet

var accountDB = require('../db/account')

var exchange = require('../domain/exchange')
const figment = require('../external/figment');

module.exports =  async function CustodialSync(address) {

    await accountDB.start(address)
    const deposits = await figment.getCustodialWalletDeposits(address)

    await Promise.all(
        deposits.map(deposit => processDeposit(deposit, address))
    )

    const withdrawals = await figment.getCustodialWalletWithdrawals(address);

    withdrawals.forEach(async withdrawal => {
        await processWithdrawals(withdrawal, address)
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