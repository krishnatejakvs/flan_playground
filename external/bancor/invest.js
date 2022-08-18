require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_URL;
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY; 
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
// const myAddress = '0x057e358E5C6890D049b22c69a5F0680EEa4b1Cac'; //TODO: replace this address with your own public address
// const myAddress = '0x3C1079dF8223540d65360B963E03c1B803C58920'
const myAddress = process.env.ETHERUM_CUSTODIAL_ADDRESS
console.log(`myaddress : ${myAddress}`)
const CONTRACT_REGISTRY_ADDRESS = "0xA6DB4B0963C37Bc959CbC0a874B5bDDf2250f26F";
const ETH_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const CONTRACT_REGISTRY_ABI = require("./abi_repository/contract-abi.json");

const contractRegistry = new web3.eth.Contract(CONTRACT_REGISTRY_ABI, CONTRACT_REGISTRY_ADDRESS);

const getLiquidityProtectionAddress = async () => (
    await contractRegistry.methods.addressOf(web3.utils.asciiToHex("LiquidityProtection")).call()
)

const getConverterRegistryAddress = async () => (
    await contractRegistry.methods.addressOf(web3.utils.asciiToHex("BancorConverterRegistry")).call()
)

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}
const fetchContractABI = async (contractAddress) => {
    await sleep(250); // To avoid etherscan rate limit of 5 rps
    const apiKey = process.env.ETHERSCAN_API_KEY;
    const url = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
    const fetch = require('node-fetch');
    const response = await fetch(url);
    const data = await response.json();
    if (data.status == 0) {
        console.log(data);
        throw new Error(`Error fetching ABI for contract address: ${contractAddress}`);
    }
    return JSON.parse(data.result);
}


const getEthbntAnchorAddress = async (converterRegistry) => {
    // this will return an array of all Converters with Dai
    const anchorAddresses = await converterRegistry.methods.getConvertibleTokenAnchors(ETH_TOKEN_ADDRESS).call();
    console.log("Pool Anchor addreses ", anchorAddresses);
    // there should only be one DAIBNT pool, so we can automatically grab the first item in the array
    const abi = await fetchContractABI(anchorAddresses[0]);
    return await anchorAddresses.filter(async address => {
        const contract = new web3.eth.Contract(abi, address);
        return await contract.methods.symbol().call() === "ETHBNT"
    })[0];
}

/**
 * 
 * @param {string} amountInEther Example: "0.01". This will invest 0.01 ether into bancor
 */
const addLiquidity = async (amountInEther) => {
    // if you're interested in saving the variable locally:
    const liquidityProtectionAddress = await getLiquidityProtectionAddress();
    const converterRegistryAddress = await getConverterRegistryAddress();
    console.log(`Liquidity Protection address: ${liquidityProtectionAddress}`);
    console.log(`Converter Registry address: ${converterRegistryAddress}`);

    const converterRegistry = new web3.eth.Contract(await fetchContractABI(converterRegistryAddress), converterRegistryAddress);
    const liquidityProtection = new web3.eth.Contract(await fetchContractABI(liquidityProtectionAddress), liquidityProtectionAddress);
    const ethbntAnchorAddress = await getEthbntAnchorAddress(converterRegistry);
    console.log(`ETHBNT Pool Anchor address: ${ethbntAnchorAddress}`);

    // we'll use an example of 100 tokens, assuming the token has 18 decimal places
    const nonce = await web3.eth.getTransactionCount(myAddress, 'latest');
    const amount = web3.utils.toWei(amountInEther, "ether");
    var getData = liquidityProtection.methods.addLiquidity(
        ethbntAnchorAddress,
        ETH_TOKEN_ADDRESS,
        amount).encodeABI();//this gives you the encoded ABI form of a 
                            //function and its parameters, it will be helpful if you are 
                            //constructing a raw transaction 
    const transaction = {
        'to': liquidityProtectionAddress, 
        'value': amount,
        'gas': 1000000,
        'maxPriorityFeePerGas': 1000000108,
        'nonce': nonce,
        'data': getData
        // optional data field to send message or execute smart contract
    };
    const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);

    return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
            if (!error) {
                console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
                resolve(hash)
            } else {
                console.log("❗Something went wrong while submitting your transaction:", error)
                reject(error)
            }
        });
    })
}

module.exports.addLiquidity = addLiquidity;

// async function main () {
//     const result = await addLiquidity("0.1");
//     console.log(`result in main: ${result}`)
// }

 
// main()