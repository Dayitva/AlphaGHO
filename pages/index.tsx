import { Avatar, ConnectKitButton } from "connectkit";
import type { NextPage } from "next";
import { ethers, BigNumber } from "ethers";
import {
  UiPoolDataProvider,
  UiIncentiveDataProvider,
  ChainId,
  Pool,
  EthereumTransactionTypeExtended
} from "@aave/contract-helpers";
import * as markets from "@bgd-labs/aave-address-book";
import {
  formatReserves,
  formatReservesAndIncentives,
  formatUserSummary,
  formatUserSummaryAndIncentives,
} from "@aave/math-utils";
import dayjs from "dayjs";
import { useAccount } from "wagmi";

// Make sure that this component is wrapped with ConnectKitProvider
const MyComponent = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting) return <div>Connecting...</div>;
  if (isDisconnected) return <div>Disconnected</div>;
  return <div>Connected Wallet: {address}</div>;
};

const MAINNET_API = "https://eth-mainnet.public.blastapi.io";
const SEPOLIA_API = "https://eth-sepolia.public.blastapi.io";

const GHO_SEPOLIA = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60";
const DAI_SEPOLIA = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357";

const AAVE_POOL_SEPOLIA = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
const WETH_GATEWAY = "test";

const test = async () => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();
  const { address, isConnecting, isDisconnected } = useAccount();
  console.log(provider);
  console.log(signer);
  console.log(await signer.getAddress());
  console.log(address);

//   async function submitTransaction({ provider : ethers.providers.Web3Provider, tx : EthereumTransactionTypeExtended }) {
//     const extendedTxData = await tx.tx();
//     console.log(tx, extendedTxData);
//     const { from, ...txData } = extendedTxData;
//     const signer = provider.getSigner(from);
//     const txResponse = await signer.sendTransaction({
//       ...txData,
//       value: txData.value ? BigNumber.from(txData.value) : undefined,
//     });
//   }

//   const pool = new Pool(provider, {
//     POOL: AAVE_POOL_SEPOLIA,
//     WETH_GATEWAY: WETH_GATEWAY,
//   });

//   /*
// - @param `user` The ethereum address that will make the deposit 
// - @param `reserve` The ethereum address of the reserve 
// - @param `amount` The amount to be deposited 
// - @param `deadline` Expiration of signature in seconds, for example, 1 hour = Math.floor(Date.now() / 1000 + 3600).toString()
// */
//   const dataToSign = await pool.signERC20Approval({
//     user: user,
//     reserve: DAI_SEPOLIA,
//     amount: ethers.utils.parseUnits("1", 18),
//     deadline: Math.floor(Date.now() / 1000 + 3600).toString(),
//   });

//   console.log(dataToSign);

//   // const signature = await wallet.provider.send("eth_signTypedData_v4", [
//   //   user,
//   //   dataToSign,
//   // ]);

//   const signature = await provider.signMessage(dataToSign);

//   console.log(signature);

//   const txs = await pool.supplyWithPermit({
//     user: user,
//     reserve: "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60",
//     amount: ethers.utils.parseUnits("1", 18),
//     signature: signature,
//     onBehalfOf: user,
//   });

//   submitTransaction({ provider: wallet.provider, tx: txs[0] });
};

const IndexPage: NextPage = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      Hi there! <br />
      <br />
      <Avatar />
      <ConnectKitButton />
      <button onClick={test}>Test</button>
    </div>
  );
};

export default IndexPage;
