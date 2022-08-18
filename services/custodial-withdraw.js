// Withdraw UST to customer wallet address

var exchange = require('../domain/exchange');
var accountsDB = require('../db/account');
var lcd = require('../external/terra-lcd');
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

/**
 *
 * @param {*} toAddress
 * @param {*} amount in UST
 */
module.exports =  async function UserWithdraw (userId, toAddress, amount) {
    const fromAddress = getAddress(userId)
    await custodialSync(fromAddress);

    console.log(amount)
    const withdrawTime = new Date();
    const withdrawFT = exchange.toFT(amount, 'UST', withdrawTime);
    await accountsDB.debit(fromAddress, withdrawFT);

    console.log(withdrawFT, withdrawTime)
    return  lcd.transfer(fromAddress, toAddress, amount, 'UST')
}

