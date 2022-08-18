const {Pool, Position, NonfungiblePositionManager, nearestUsableTick,} = require('@uniswap/v3-sdk/')
const { ethers } = require("ethers");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { Percent, Token, CurrencyAmount } = require("@uniswap/sdk-core");
const { abi } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");


const IUniswapV3PoolABI = abi

// import { abi as NonfungiblePositionManagerABI } from "@uniswap/v3-periphery/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_URL;
const web3 = createAlchemyWeb3(alchemyKey);
const PRIVATE_KEY = process.env.UNISWAP_WALLET_PRIVATE_KEY;
const provider = new ethers.providers.JsonRpcProvider(alchemyKey);
let wallet = new ethers.Wallet(PRIVATE_KEY);
//signer - me(interacted to sign the transations to be sent to the blockchain)
const signer = new ethers.Wallet( PRIVATE_KEY, provider);

// pool address for USDC/DAI 0.05%
const poolAddress = "0x3dE4eFc0EAe5dC583Dde45833FcE5E0a058c1c1a";
const NFTPositionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

const myAddress = process.env.UNISWAP_CUSTODIAL_ADDRESS
// const myAddress = '0x4bE8a656C3C2dfc3171c762c0b4BE73b719CAb36'; //TODO: replace this address with your own public address


const CONTRACT_REGISTRY_ABI = require("./abi/nftmanager.json");
const { template } = require('lodash');
// We connect to the Contract using a Provider, so we will only
// have read-only access to the Contract
const NFTPositionManagerContract = new ethers.Contract(
  NFTPositionManagerAddress, 
  CONTRACT_REGISTRY_ABI,
  signer);
// Create a new instance of the Contract with a Signer, which allows
// update methods
const NFTPositionManagerWithSigner = NFTPositionManagerContract.connect(signer);

const poolContract = new ethers.Contract(
poolAddress,
IUniswapV3PoolABI,
provider
);

async function getPoolImmutables() {
const immutables = {
  factory: await poolContract.factory(),
  token0: await poolContract.token0(),
  token1: await poolContract.token1(),
  fee: await poolContract.fee(),
  tickSpacing: await poolContract.tickSpacing(),
  maxLiquidityPerTick: await poolContract.maxLiquidityPerTick(),
};
return immutables;
}

async function getPoolState() {
const slot = await poolContract.slot0();
const PoolState = {
  liquidity: await poolContract.liquidity(),
  sqrtPriceX96: slot[0],
  tick: slot[1],
  observationIndex: slot[2],
  observationCardinality: slot[3],
  observationCardinalityNext: slot[4],
  feeProtocol: slot[5],
  unlocked: slot[6],
};
return PoolState;
}


async function addLiquidity() {
  const immutables = await getPoolImmutables();
  const state = await getPoolState();
  console.log(`state ${state}`);
  const USDC = new Token(1, immutables.token0, 18, "USDC", "USD Coin");
  const DAI = new Token(1, immutables.token1, 18, "DAI", "Stablecoin");
  const block = await provider.getBlock(provider.getBlockNumber());

  const deadline = block.timestamp + 200;

  //create a pool
  const DAI_USDC_POOL = new Pool(
    USDC,
    DAI,
    immutables.fee,
    state.sqrtPriceX96.toString(),
    state.liquidity.toString(),
    state.tick
  );

  // create a position with the pool
  // the position is in-range, specified by the lower and upper tick
  // in this example, we will set the liquidity parameter to a small percentage of the current liquidity
  const position = new Position({
    pool: DAI_USDC_POOL,
    liquidity: state.liquidity.div(5).toString(),
    tickLower: nearestUsableTick(state.tick, immutables.tickSpacing) - immutables.tickSpacing  * 2,
    tickUpper: nearestUsableTick(state.tick, immutables.tickSpacing) + immutables.tickSpacing * 2
  })


  const {calldata ,value} = NonfungiblePositionManager.addCallParameters(position, {
        slippageTolerance: new Percent(50, 10000), // CHANGED
        deadline: deadline,
        tokenId: 17261
        });
  console.log("calldata ", calldata);
  console.log("value ", value);

  // const params = [17261, 10, 3.5, 10,3.5, deadline ];
  const nonce = await signer.getTransactionCount('latest');
  console.log("nonce ", nonce);
  const transaction = {
    'to': NFTPositionManagerAddress, 
    'value': value,
    'gas': 1000000,
    'maxPriorityFeePerGas': 1000000108,
    'nonce': nonce,
    'data': calldata
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

// liquidityExamples("0x4bE8a656C3C2dfc3171c762c0b4BE73b719CAb36", 1)