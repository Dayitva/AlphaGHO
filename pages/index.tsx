import { ConnectKitButton } from "connectkit";
import type { NextPage } from "next";
import { ethers } from "ethers";
import {
  Pool,
  EthereumTransactionTypeExtended,
  InterestRate,
} from "@aave/contract-helpers";
import * as markets from "@bgd-labs/aave-address-book";
import { useAccount} from "wagmi";
import React, { useState } from "react";

const GHO_SEPOLIA = markets.AaveV3Sepolia.ASSETS.GHO.UNDERLYING;
const DAI_SEPOLIA = markets.AaveV3Sepolia.ASSETS.DAI.UNDERLYING;
const USDC_SEPOLIA = markets.AaveV3Sepolia.ASSETS.USDC.UNDERLYING;
const USDT_SEPOLIA = markets.AaveV3Sepolia.ASSETS.USDT.UNDERLYING;
const WBTC_SEPOLIA = markets.AaveV3Sepolia.ASSETS.WBTC.UNDERLYING;
const LINK_SEPOLIA = markets.AaveV3Sepolia.ASSETS.LINK.UNDERLYING;

const nameToReserve = {
  GHO: GHO_SEPOLIA,
  DAI: DAI_SEPOLIA,
  USDC: USDC_SEPOLIA,
  USDT: USDT_SEPOLIA,
  WBTC: WBTC_SEPOLIA,
  LINK: LINK_SEPOLIA,
};

const AAVE_POOL_SEPOLIA = markets.AaveV3Sepolia.POOL;
const WETH_GATEWAY_SEPOLIA = markets.AaveV3Sepolia.WETH_GATEWAY;

const DEADLINE = Math.floor(Date.now() / 1000 + 3600).toString();

const PRIV_KEY =
  process.env.NEXT_PUBLIC_EXECUTOR_PRIV_KEY ||
  "test";
const INFURA_ID =
  process.env.NEXT_PUBLIC_INFURA_ID || "test";

const assets = ["GHO", "DAI", "USDC", "USDT", "WBTC", "LINK"];

async function submitTransaction({
  provider,
  tx,
}: {
  provider: any;
  tx: EthereumTransactionTypeExtended;
}) {
  console.log(tx);
  const extendedTxData = await tx.tx();
  console.log(tx, extendedTxData);
  const { from, ...txData } = extendedTxData;
  // const signer = provider.getSigner(from);
  // console.log(signer);
  const txResponse = await provider.sendTransaction({
    ...txData,
    value: 0,
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

const supplyWithPermit = async (
  address: string,
  asset: string,
  amount: string
) => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);

  const pool = new Pool(provider, {
    POOL: AAVE_POOL_SEPOLIA,
    WETH_GATEWAY: WETH_GATEWAY_SEPOLIA,
  });

  const infura_provider = new ethers.providers.InfuraProvider(
    "sepolia",
    INFURA_ID
  );

  const wallet = new ethers.Wallet(PRIV_KEY, infura_provider);

  console.log(provider);
  console.log(pool);
  console.log(wallet);

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

  const txResponse = await submitTransaction({ provider: wallet, tx: txs[0] });
  console.log(txResponse);
};

const repayWithPermit = async (
  address: string,
  asset: string,
  amount: string
) => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);

  const pool = new Pool(provider, {
    POOL: AAVE_POOL_SEPOLIA,
    WETH_GATEWAY: WETH_GATEWAY_SEPOLIA,
  });

  const infura_provider = new ethers.providers.InfuraProvider(
    "sepolia",
    INFURA_ID
  );

  const wallet = new ethers.Wallet(PRIV_KEY, infura_provider);

  console.log(provider);
  console.log(pool);
  console.log(wallet);

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

  const txResponse = await submitTransaction({
    provider: wallet,
    tx: txs[0],
  });

  console.log(txResponse);
};

const borrow = async (address: string, asset: string, amount: string) => {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);

  const pool = new Pool(provider, {
    POOL: AAVE_POOL_SEPOLIA,
    WETH_GATEWAY: WETH_GATEWAY_SEPOLIA,
  });

  console.log(provider);
  console.log(pool);

  const txs: EthereumTransactionTypeExtended[] = await pool.borrow({
    user: address,
    reserve: asset,
    amount: amount,
    interestRateMode: InterestRate.Variable,
    onBehalfOf: address,
  });

  submitTransaction({ provider: provider, tx: txs[0] });
};

const renderSupplyButton = (address: string, asset: string, amount: string) => (
  <button
    className="cta-button connect-wallet-button"
    onClick={() => supplyWithPermit(address, asset, amount)}
  >
    Supply
  </button>
);

const renderRepayButton = (address: string, asset: string, amount: string) => (
  <button
    className="cta-button connect-wallet-button"
    onClick={() => repayWithPermit(address, asset, amount)}
  >
    Repay
  </button>
);

const renderBorrowButton = (address: string, asset: string, amount: string) => (
  <button
    className="cta-button connect-wallet-button"
    onClick={() => borrow(address, asset, amount)}
  >
    Borrow
  </button>
);

const IndexPage: NextPage = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);

  const onChangeAmount = (event: any) => {
    setAmount(event.target.value);
    console.log(amount);
  };

  const handleAssetChange = (event: any) => {
    setSelectedAsset(event.target.value);
    console.log(selectedAsset);
  };

  return (
    <div>
      <div className="App">
        <div className="container">
          <div className="header-container">
            <p className="header gradient-text">AlphaGHO</p>
            <p className="sub-text">
              One-stop shop for all things GHO, completely gasless!
            </p>

            <p className="sub-text"></p>
            <p className="sub-text">
              <div className="family-button">
                <ConnectKitButton />
              </div>
              {address === undefined ? null : (
                <div>
                  {renderSupplyButton(address, selectedAsset, amount)} &nbsp;
                  &nbsp;
                  {renderBorrowButton(address, selectedAsset, amount)} &nbsp;
                  &nbsp;
                  {renderRepayButton(address, selectedAsset, amount)} &nbsp; &nbsp;
                </div>
              )}
            </p>
            <br />
            <p className="sub-text">
              {/* <div className="flex items-center"> */}
              <form className="waveButton">
                <label>
                  <input
                    type="text"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={onChangeAmount}
                    required
                  />
                </label>
              </form>
              <select
                value={selectedAsset}
                onChange={handleAssetChange}
                className="dropdown mt-4"
              >
                {assets.map((asset) => (
                  <option key={asset} value={asset}>
                    {asset}
                  </option>
                ))}
              </select>
              {/* </div> */}
            </p>
          </div>

          <div className="footer-container">
            <p className="footer-text"> Made with ❤️ by Dayitva Goel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
