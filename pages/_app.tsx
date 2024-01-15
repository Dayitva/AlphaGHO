import { AppProps } from "next/app";

import { WagmiConfig, createClient, chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

const client = createClient(
  getDefaultClient({
    appName: "ConnectKit Next.js demo",
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    //infuraId: process.env.INFURA_ID,
    chains: [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum]
  })
);

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App;
