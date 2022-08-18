// Withdraw UST to customer wallet address

var exchange = require('../domain/exchange');
var accountsDB = require('../db/account');
var lcd = require('../external/terra-lcd');


/**
 *
 * @param {*} address
 * @param {*} amount in UST
 */
module.exports =  async function withdraw (address, amount) {
    const withdrawTime = new Date();
    const withdrawFT = exchange.toFT(amount, 'UST', withdrawTime);
    await accountsDB.debit(address, withdrawFT);

    console.log(withdrawFT, withdrawTime)
    return  lcd.send(address, amount, 'UST')
}

