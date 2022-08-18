const { LCDClient, Coin } = require('@terra-money/terra.js');

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env')});

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

async function main() {
    const FLAN_WALLET_TERRA = process.env.FLAN_ADDRESS;
    const SENDER_WALLET_TERRA = 'terra1y02duyrmwq89yaxmvpqfvwkfmlswtd80el43ry';

    const result = await terra.tx.search({events: [
      {
        key: 'transfer.recipient',
        value: FLAN_WALLET_TERRA
      },
      {
        key: 'transfer.sender',
        value: SENDER_WALLET_TERRA
      }
    ]});

    console.log(JSON.stringify(result));
    //console.log(result)
    // const marketParams = await terra.market.parameters();
    // const exchangeRates = await terra.oracle.exchangeRates();
    // console.log(marketParams.base_pool);
    // console.log(exchangeRates.get('uusd'));    
  }

main();