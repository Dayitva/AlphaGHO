import { Avatar, ConnectKitButton } from "connectkit";
import type { NextPage } from "next";
import { ethers, BigNumber } from "ethers";
import {
  UiPoolDataProvider,
  UiIncentiveDataProvider,
  ChainId,
  Pool,
  EthereumTransactionTypeExtended,
  InterestRate,
} from "@aave/contract-helpers";
import * as markets from "@bgd-labs/aave-address-book";
import {
  formatReserves,
  formatReservesAndIncentives,
  formatUserSummary,
  formatUserSummaryAndIncentives,
} from "@aave/math-utils";
import dayjs from "dayjs";
import { useAccount, useSignTypedData, useSignMessage } from "wagmi";
import { useEffect, useState } from "react";

// Make sure that this component is wrapped with ConnectKitProvider
const MyComponent = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting) return <div>Connecting...</div>;
  if (isDisconnected) return <div>Disconnected</div>;
  return <div>Connected Wallet: {address}</div>;
};

const MAINNET_API = "https://eth-mainnet.public.blastapi.io";
const SEPOLIA_API = "https://eth-sepolia.public.blastapi.io";

const GHO_SEPOLIA = markets.AaveV3Sepolia.ASSETS.GHO.UNDERLYING;
const DAI_SEPOLIA = markets.AaveV3Sepolia.ASSETS.DAI.UNDERLYING;
const USDC_SEPOLIA = markets.AaveV3Sepolia.ASSETS.USDC.UNDERLYING;
const USDT_SEPOLIA = markets.AaveV3Sepolia.ASSETS.USDT.UNDERLYING;

const AAVE_POOL_SEPOLIA = markets.AaveV3Sepolia.POOL;
const WETH_GATEWAY_SEPOLIA = markets.AaveV3Sepolia.WETH_GATEWAY;

const DEADLINE = Math.floor(Date.now() / 1000 + 3600).toString();

const [pool, setPool] = useState<any>(null);
const [provider, setProvider] = useState<any>(null);

useEffect(() => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);

  const pool = new Pool(provider, {
    POOL: AAVE_POOL_SEPOLIA,
    WETH_GATEWAY: WETH_GATEWAY_SEPOLIA,
  });

  console.log(provider);
  console.log(pool);

  setPool(pool);
  setProvider(provider);
}, []);

async function submitTransaction({
  provider,
  tx,
}: {
  provider: ethers.providers.Web3Provider;
  tx: EthereumTransactionTypeExtended;
}) {
  console.log(tx);
  const extendedTxData = await tx.tx();
  console.log(tx, extendedTxData);
  const { from, ...txData } = extendedTxData;
  const signer = provider.getSigner(from);
  const txResponse = await signer.sendTransaction({
    ...txData,
    value: txData.value ? BigNumber.from(txData.value) : undefined,
  });
  return txResponse;
}

async function approveAndSign({
  pool,
  provider,
  address,
  asset,
  amount,
}: {
  pool: any;
  provider: ethers.providers.Web3Provider;
  address: string;
  asset: string;
  amount: string;
}) {
  const dataToSign = await pool.signERC20Approval({
    user: address,
    reserve: asset,
    amount: amount,
    deadline: DEADLINE,
  });

  console.log(dataToSign);

  const signature = await provider.send("eth_signTypedData_v4", [
    address,
    dataToSign,
  ]);

  console.log(signature);

  return signature;
}

const supply = async (address: string, asset: string, amount: string) => {
  const signature = await approveAndSign({
    pool: pool,
    provider: provider,
    address: address,
    asset: asset,
    amount: amount,
  });

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await wait(2000);
  console.log("done");

  const txs: EthereumTransactionTypeExtended[] = await pool.supplyWithPermit({
    user: address,
    reserve: asset,
    amount: amount,
    signature: signature,
    onBehalfOf: address,
    deadline: DEADLINE,
  });

  submitTransaction({ provider: provider, tx: txs[0] });
};

const repay = async (address: string, asset: string, amount: string) => {
  const signature = await approveAndSign({
    pool: pool,
    provider: provider,
    address: address,
    asset: asset,
    amount: amount,
  });

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await wait(2000);
  console.log("done");

  const txs: EthereumTransactionTypeExtended[] = await pool.repayWithPermit({
      user: address,
      reserve: asset,
      amount: amount,
      signature: signature,
      onBehalfOf: address,
      deadline: DEADLINE,
      interestRateMode: InterestRate.Variable,
    });

  submitTransaction({ provider: provider, tx: txs[0] });
};

const test = async (address: any) => {
  const executePlan = async () => {
    const dataToSign = await pool.signERC20Approval({
      user: address,
      reserve: USDT_SEPOLIA,
      amount: "1",
      deadline: DEADLINE,
    });

    console.log(dataToSign);

    const signature = await provider.send("eth_signTypedData_v4", [
      address,
      dataToSign,
    ]);

    console.log(signature);

    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await wait(2000);
    console.log("done");

    // const txs: EthereumTransactionTypeExtended[] = await pool.supplyWithPermit({
    //   user: address,
    //   reserve: USDC_SEPOLIA,
    //   amount: "1",
    //   signature: signature,
    //   onBehalfOf: address,
    //   deadline: DEADLINE,
    // });

    // const txs: EthereumTransactionTypeExtended[] = await pool.supply({
    //   user: address,
    //   reserve: USDC_SEPOLIA,
    //   amount: "10",
    //   onBehalfOf: address,
    // });

    const txs: EthereumTransactionTypeExtended[] = await pool.borrow({
      user: address,
      reserve: USDT_SEPOLIA,
      amount: "1",
      interestRateMode: InterestRate.Variable,
      onBehalfOf: address,
    });

    // const txs: EthereumTransactionTypeExtended[] = await pool.repayWithPermit({
    //   user: address,
    //   reserve: GHO_SEPOLIA,
    //   amount: "1",
    //   signature: signature,
    //   onBehalfOf: address,
    //   deadline: DEADLINE,
    //   interestRateMode: InterestRate.Variable,
    // });

    // const txs: EthereumTransactionTypeExtended[] = await pool.repay({
    //   user: address,
    //   reserve: GHO_SEPOLIA,
    //   amount: "1",
    //   onBehalfOf: address,
    //   interestRateMode: InterestRate.Variable,
    // });

    console.log(txs);

    await submitTransaction({ provider: provider, tx: txs[0] });
    // setTimeout(async () => {
    //   await submitTransaction({ provider: provider, tx: txs[1] });
    // }, 45000);
  };

  executePlan().catch((error) => {
    console.error(error);
  });
};

const IndexPage: NextPage = () => {
  return (
    <div>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        Hi there!
        <ConnectKitButton />
        <button
          onClick={() => test("0x039b882C4aF8Dc66c906dA6a44c6e2A561BB5223")}
        >
          Test
        </button>
      </div>
    </div>
  );
};

export default IndexPage;
