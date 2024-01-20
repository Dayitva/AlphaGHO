import { AppProps } from "next/app";

import { WagmiConfig, createConfig } from "wagmi";
import { mainnet, sepolia, polygon, optimism, arbitrum } from "wagmi/chains";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const chains = [mainnet, sepolia, polygon, optimism, arbitrum];

const config = createConfig(
  getDefaultConfig({
    appName: "AlphaGHO",
    // alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    infuraId: process.env.INFURA_ID,
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID || "test",
    chains: chains,

    // Optional
    appDescription: "Making Payments and Arbitrage easier for GHO on Aave",
    appUrl: "https://alphagho.com",
    appIcon: "https://family.co/logo.png",
  })
);

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App;
