import { ethers, BigNumber } from "ethers";
import {
  UiPoolDataProvider,
  UiIncentiveDataProvider,
  ChainId,
  Pool,
} from "@aave/contract-helpers";
import * as markets from "@bgd-labs/aave-address-book";
import {
  formatReserves,
  formatReservesAndIncentives,
  formatUserSummary,
  formatUserSummaryAndIncentives,
} from "@aave/math-utils";
import dayjs from "dayjs";

// ES5 Alternative imports
//  const {
//    ChainId,
//    UiIncentiveDataProvider,
//    UiPoolDataProvider,
//  } = require('@aave/contract-helpers');
//  const markets = require('@bgd-labs/aave-address-book');
//  const ethers = require('ethers');

const mainnet_api = "https://eth-mainnet.public.blastapi.io";
const sepolia_api = "https://eth-sepolia.public.blastapi.io";

const gho_sepolia = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60";
const dai_sepolia = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357";

// Sample RPC address for querying ETH mainnet
// const provider = new ethers.providers.JsonRpcProvider(sepolia_api);

// const provider = new ethers.providers.InfuraProvider(
//   "sepolia",
//   "f707d120307447bcbb5d531e535518ad"
// );
// const signer = provider.getSigner();
// const currentAccoun = await signer.getAddress();

// create a provider using window.ethereum (Metamask)
const provider = new ethers.providers.Web3Provider(window.ethereum);
console.log(provider);


// const privateKeyETHIndia =
//   "768d5d3ed85e4c08025f3168063129a0707ea7d0fc164eec12230d492ab1b226";
// const privateKeyAcc2 =
//   "e1be358071dfefe29c6f41d496132da285a8643ceadcd7832dc462c24b9760ce";
// const wallet = new ethers.Wallet(privateKeyAcc2, provider);

// // console.log(wallet);

// // User address to fetch data for, insert address here
// const user = "0x039b882C4aF8Dc66c906dA6a44c6e2A561BB5223";

// // View contract used to fetch all reserves data (including market base currency data), and user reserves
// // Using Aave V3 Eth Mainnet address for demo
// const poolDataProviderContract = new UiPoolDataProvider({
//   uiPoolDataProviderAddress: markets.AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
//   provider,
//   chainId: ChainId.mainnet,
// });

// // View contract used to fetch all reserve incentives (APRs), and user incentives
// // Using Aave V3 Eth Mainnet address for demo
// const incentiveDataProviderContract = new UiIncentiveDataProvider({
//   uiIncentiveDataProviderAddress:
//     markets.AaveV3Ethereum.UI_INCENTIVE_DATA_PROVIDER,
//   provider,
//   chainId: ChainId.mainnet,
// });

// async function fetchContractData() {
//   // Object containing array of pool reserves and market base currency data
//   // { reservesArray, baseCurrencyData }
//   const reserves = await poolDataProviderContract.getReservesHumanized({
//     lendingPoolAddressProvider: markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
//   });

//   // Object containing array or users aave positions and active eMode category
//   // { userReserves, userEmodeCategoryId }
//   const userReserves = await poolDataProviderContract.getUserReservesHumanized({
//     lendingPoolAddressProvider: markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
//     user: user,
//   });

//   // Array of incentive tokens with price feed and emission APR
//   const reserveIncentives =
//     await incentiveDataProviderContract.getReservesIncentivesDataHumanized({
//       lendingPoolAddressProvider:
//         markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
//     });

//   // Dictionary of claimable user incentives
//   const userIncentives =
//     await incentiveDataProviderContract.getUserReservesIncentivesDataHumanized({
//       lendingPoolAddressProvider:
//         markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
//       user: user,
//     });

//   const reservesArray = reserves.reservesData;
//   const userReservesArray = userReserves.userReserves;
//   const baseCurrencyData = reserves.baseCurrencyData;

//   const currentTimestamp = dayjs().unix();

//   /*
// - @param `reserves` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.reservesArray`
// - @param `currentTimestamp` Current UNIX timestamp in seconds
// - @param `marketReferencePriceInUsd` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferencePriceInUsd`
// - @param `marketReferenceCurrencyDecimals` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferenceCurrencyDecimals`
// */
//   const formattedPoolReserves1 = formatReserves({
//     reserves: reservesArray,
//     currentTimestamp,
//     marketReferenceCurrencyDecimals:
//       baseCurrencyData.marketReferenceCurrencyDecimals,
//     marketReferencePriceInUsd:
//       baseCurrencyData.marketReferenceCurrencyPriceInUsd,
//   });

//   /*
// - @param `reserves` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.reservesArray`
// - @param `currentTimestamp` Current UNIX timestamp in seconds, Math.floor(Date.now() / 1000)
// - @param `marketReferencePriceInUsd` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferencePriceInUsd`
// - @param `marketReferenceCurrencyDecimals` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferenceCurrencyDecimals`
// - @param `reserveIncentives` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserveIncentives`
// */
//   const formattedPoolReserves2 = formatReservesAndIncentives({
//     reserves: reservesArray,
//     currentTimestamp,
//     marketReferenceCurrencyDecimals:
//       baseCurrencyData.marketReferenceCurrencyDecimals,
//     marketReferencePriceInUsd:
//       baseCurrencyData.marketReferenceCurrencyPriceInUsd,
//     reserveIncentives,
//   });

//   /*
// - @param `currentTimestamp` Current UNIX timestamp in seconds, Math.floor(Date.now() / 1000)
// - @param `marketReferencePriceInUsd` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferencePriceInUsd`
// - @param `marketReferenceCurrencyDecimals` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferenceCurrencyDecimals`
// - @param `userReserves` Input from [Fetching Protocol Data](#fetching-protocol-data), combination of `userReserves.userReserves` and `reserves.reservesArray`
// - @param `userEmodeCategoryId` Input from [Fetching Protocol Data](#fetching-protocol-data), `userReserves.userEmodeCategoryId`
// */
//   const userSummary1 = formatUserSummary({
//     currentTimestamp,
//     marketReferencePriceInUsd:
//       baseCurrencyData.marketReferenceCurrencyPriceInUsd,
//     marketReferenceCurrencyDecimals:
//       baseCurrencyData.marketReferenceCurrencyDecimals,
//     userReserves: userReservesArray,
//     formattedReserves: formattedPoolReserves1,
//     userEmodeCategoryId: userReserves.userEmodeCategoryId,
//   });

//   /*
// - @param `currentTimestamp` Current UNIX timestamp in seconds, Math.floor(Date.now() / 1000)
// - @param `marketReferencePriceInUsd` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferencePriceInUsd`
// - @param `marketReferenceCurrencyDecimals` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserves.baseCurrencyData.marketReferenceCurrencyDecimals`
// - @param `userReserves` Input from [Fetching Protocol Data](#fetching-protocol-data), combination of `userReserves.userReserves` and `reserves.reservesArray`
// - @param `userEmodeCategoryId` Input from [Fetching Protocol Data](#fetching-protocol-data), `userReserves.userEmodeCategoryId`
// - @param `reserveIncentives` Input from [Fetching Protocol Data](#fetching-protocol-data), `reserveIncentives`
// - @param `userIncentives` Input from [Fetching Protocol Data](#fetching-protocol-data), `userIncentives`
// */
//   const userSummary2 = formatUserSummaryAndIncentives({
//     currentTimestamp,
//     marketReferencePriceInUsd:
//       baseCurrencyData.marketReferenceCurrencyPriceInUsd,
//     marketReferenceCurrencyDecimals:
//       baseCurrencyData.marketReferenceCurrencyDecimals,
//     userReserves: userReservesArray,
//     formattedReserves: formattedPoolReserves2,
//     userEmodeCategoryId: userReserves.userEmodeCategoryId,
//     reserveIncentives,
//     userIncentives,
//   });

//   console.log({ reserves, userReserves, reserveIncentives, userIncentives });
//   console.log({
//     formattedPoolReserves1,
//     formattedPoolReserves2,
//     userSummary1,
//     userSummary2,
//   });
// }

// // fetchContractData();

// async function submitTransaction({ provider, tx }) {
//   const extendedTxData = await tx.tx();
//   console.log(tx, extendedTxData);
//   const { from, ...txData } = extendedTxData;
//   const signer = provider.getSigner(from);
//   const txResponse = await signer.sendTransaction({
//     ...txData,
//     value: txData.value ? BigNumber.from(txData.value) : undefined,
//   });
// }

// const pool = new Pool(provider, {
//   POOL: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
//   WETH_GATEWAY: "test",
// });

// /*
// - @param `user` The ethereum address that will make the deposit 
// - @param `reserve` The ethereum address of the reserve 
// - @param `amount` The amount to be deposited 
// - @param `deadline` Expiration of signature in seconds, for example, 1 hour = Math.floor(Date.now() / 1000 + 3600).toString()
// */
// const dataToSign = await pool.signERC20Approval({
//   user: user,
//   reserve: dai_sepolia,
//   amount: ethers.utils.parseUnits("1", 18),
//   deadline: Math.floor(Date.now() / 1000 + 3600).toString(),
// });

// console.log(dataToSign);

// // const signature = await wallet.provider.send("eth_signTypedData_v4", [
// //   user,
// //   dataToSign,
// // ]);

// const signature = await wallet.signMessage(dataToSign);

// console.log(signature);

// const txs = await pool.supplyWithPermit({
//   user: user,
//   reserve: "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60",
//   amount: ethers.utils.parseUnits("1", 18),
//   signature: signature,
//   onBehalfOf: user,
// });

// submitTransaction({ provider: wallet.provider, tx: txs[0] });
