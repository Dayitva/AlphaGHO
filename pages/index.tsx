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

const test = async (address: any) => {
  // const { signTypedData } = useSignTypedData();
  // const { signMessage } = useSignMessage();
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();
  console.log(provider);
  console.log(signer);
  console.log(await signer.getAddress());
  console.log(address);

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
      gasLimit: ethers.utils.parseUnits('0.1', 'ether'),
    });
  }

  const pool = new Pool(provider, {
    POOL: AAVE_POOL_SEPOLIA,
    WETH_GATEWAY: WETH_GATEWAY_SEPOLIA,
  });

  console.log(pool);

  const executePlan = async () => {
    const dataToSign = await pool.signERC20Approval({
      user: address,
      reserve: USDC_SEPOLIA,
      amount: "1",
      deadline: Math.floor(Date.now() / 1000 + 3600).toString(),
    });
  
    console.log(dataToSign);
  
    const signature = await provider.send("eth_signTypedData_v4", [
      address,
      dataToSign,
    ]);
  
    console.log(signature);
  
    const txs: EthereumTransactionTypeExtended[] = await pool.supplyWithPermit({
      user: address,
      reserve: USDC_SEPOLIA,
      amount: "1",
      signature: signature,
      onBehalfOf: address,
      deadline: Math.floor(Date.now() / 1000 + 3600).toString(),
    });

    
    // const txs: EthereumTransactionTypeExtended[] = await pool.supply({
    //   user: address,
    //   reserve: USDC_SEPOLIA,
    //   amount: "1",
    //   onBehalfOf: address,
    // });

    console.log(txs);

    // const txs: EthereumTransactionTypeExtended[] = await pool.borrow({
    //   user: address,
    //   reserve: GHO_SEPOLIA,
    //   amount: "1",
    //   interestRateMode: InterestRate.Variable,
    //   onBehalfOf: address,
    // });

    submitTransaction({ provider: provider, tx: txs[0] });
  };

  executePlan().catch((error) => {
    console.error(error);
  });
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
      Hi there!
      <ConnectKitButton />
      <button
        onClick={() => test("0x039b882C4aF8Dc66c906dA6a44c6e2A561BB5223")}
      >
        Test
      </button>
    </div>
  );
};

export default IndexPage;
