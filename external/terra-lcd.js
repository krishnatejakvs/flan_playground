const { LCDClient, MsgSend, MnemonicKey } = require('@terra-money/terra.js');

// create a key out of a mnemonic
const mk = new MnemonicKey({
    mnemonic: process.env.FLAN_MNEMONIC, // Add your MNEMONIC in .env file
});

// connect to bombay testnet
const terra = new LCDClient({
  URL: 'https://bombay-lcd.terra.dev',
  chainID: 'bombay-12',
});

// To use LocalTerra
// const terra = new LCDClient({
//   URL: 'http://localhost:1317',
//   chainID: 'localterra'
// });

// a wallet can be created out of any key
// wallets abstract transaction building
const wallet = terra.wallet(mk);

/**
 * 
 * @param {*} toAddress 
 * @param {*} amount 
 * @param {*} currency 
 * @returns 
 */
async function send(toAddress, amount, currency) {
    fromAddress = process.env.FLAN_ADDRESS

    if (currency != 'UST') {
        throw new Error ('currency not supported')
    }
    // create a simple message that moves coin balances

    const send = new MsgSend(
        fromAddress,
        toAddress,
        { uusd: amount * (10**6) }
    );
    

    let tx = await wallet.createAndSignTx({
      msgs: [send],
      memo: 'test from terra.js!',
    })

    result = terra.tx.broadcast(tx)
    console.log(`TX hash: ${result.txhash}`);
    console.log(result)
    return result
}

/**
 * 
 * @param {*} toAddress 
 * @param {*} amount 
 * @param {*} currency 
 * @returns 
 */
 async function transfer(fromAddress, toAddress, amount, currency) {
    if (currency != 'UST') {
        throw new Error ('currency not supported')
    }
    // create a simple message that moves coin balances

    const send = new MsgSend(
        fromAddress,
        toAddress,
        { uusd: amount * (10**6) }
    );
    

    let tx = await wallet.createAndSignTx({
      msgs: [send],
      memo: 'test from terra.js!',
    })

    result = terra.tx.broadcast(tx)
    console.log(`TX hash: ${result.txhash}`);
    console.log(result)
    return result
}



module.exports.send = send;
module.exports.transfer = transfer;


async function main() {
    result = await send('terra1y02duyrmwq89yaxmvpqfvwkfmlswtd80el43ry', 10, 'UST');
    console.log(result)
}

// main()
