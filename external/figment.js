// Module to provide the deposit history of a sender

/**
 * Using figment as the deposit history provider.
 * 
 * TODO: Requires changes.
 */




var _ = require('lodash')
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env')});


const { LCDClient } = require('@terra-money/terra.js');

const FIGMENT_ENDPOINTS_TERRA = {
  'BOMBAY_12': `https://bombay-12--lcd--full.datahub.figment.io/apikey/${process.env.FIGMENT_API_KEY}`,
  'COLUMBUS_5': `https://columbus-5--lcd--full.datahub.figment.io/apikey/${process.env.FIGMENT_API_KEY}`
}

const NETWORKS_TERRA = {
  'BOMBAY_12': 'bombay-12',
  'COLUMBUS_5': 'columbus-5'
}

// connect to bombay testnet
const terra = new LCDClient({
  URL: FIGMENT_ENDPOINTS_TERRA.BOMBAY_12,
  chainID: NETWORKS_TERRA.BOMBAY_12,
});


/**
 * Get deposit History for the sender.
 * 
 * @param {*} sender 
 * @returns 
 */
async function getDepositHistory(sender) {
    const FLAN_WALLET_TERRA = process.env.FLAN_ADDRESS;

    const result = await terra.tx.search({events: [
      {
        key: 'transfer.recipient',
        value: FLAN_WALLET_TERRA
      },
      {
        key: 'transfer.sender',
        value: sender
      }
    ]});

    return toTxs(result.txs);
}

async function getWithdrawalHistory(withdrawAddress) {
  const FLAN_WALLET_TERRA = process.env.FLAN_ADDRESS;

  const result = await terra.tx.search({events: [
    {
      key: 'transfer.recipient',
      value: withdrawAddress
    },
    {
      key: 'transfer.sender',
      value: FLAN_WALLET_TERRA
    }
  ]});

  return toTxs(result.txs);
}

/**
 * get all the deposits done on custodial wallet `address`
 * @param {string} address The address of the custodial wallet
 */
async function getCustodialWalletDeposits(address) {
  const result = await terra.tx.search({events: [
    {
      key: 'transfer.recipient',
      value: address
    }
  ]});

  return toTxs(result.txs);
}


/**
 * get all the withdrawals done from custodial wallet `address`
 * @param {string} address The address of the custodial wallet
 */
 async function getCustodialWalletWithdrawals(address) {
  const result = await terra.tx.search({events: [
    {
      key: 'transfer.sender',
      value: address
    }
  ]});

  return toTxs(result.txs);
}

/**
 * Converts the txn history response to Tx objects
 */
function toTxs(terraTxs) {
    /**
     * FIXME: Currently, the function assumes that all the txss are valid.
     * Also, the response is parsed without considering failed cases and corner cases (if any)
     */
     const txs = _.map(terraTxs, tx => {
      /**
       * {
          type: 'transfer',
          attributes: [
            {
              key: 'recipient',
              value: 'terra1sfsfddsxyz''
            },
            {
              key: 'sender',
              value: 'terra1y02duyrmwq89yaxmvpqfvwkfmlswtd80el43ry'
            },
            { key: 'amount', value: '50000000uusd' }
          ]
        }
       */
      const transferEvent = _.find(tx.logs[0].events, {type: 'transfer'});


      // { key: 'amount', value: '50000000uusd' }
      const amountObj = _.find(transferEvent.attributes, {key: 'amount'})

      const [amount, currency] = amountObj.value.match(/[0-9]+|[a-zA-Z]+/g)
      return {
        amount: amount, // string
        currency: currency, // we get it in uusd. Based on my understanding, 1 UST = 10^6 uusd.
        time: new Date(tx.timestamp)
      }
  })

  return txs;
}


module.exports.getDepositHistory = getDepositHistory;
module.exports.getWithdrawalHistory = getWithdrawalHistory;
module.exports.getCustodialWalletDeposits = getCustodialWalletDeposits;
module.exports.getCustodialWalletWithdrawals = getCustodialWalletWithdrawals;