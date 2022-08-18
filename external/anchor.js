const { MnemonicKey, AnchorEarn, CHAINS, NETWORKS } = require('@anchor-protocol/anchor-earn')


var anchorEarn;

module.exports = function getAnchorEarnSDK() {
    if (!anchorEarn) {
        // INITIALIZE ANCHOR EARN SDK

        const account = new MnemonicKey({
            mnemonic: process.env.FLAN_MNEMONIC, // Add your MNEMONIC in .env file
        });

        anchorEarn = new AnchorEarn({
            chain: CHAINS.TERRA,
            network: NETWORKS.BOMBAY_12,
            privateKey: account.privateKey,
        });
    }

    return anchorEarn


}