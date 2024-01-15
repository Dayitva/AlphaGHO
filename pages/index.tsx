import { ConnectKitButton } from "connectkit";
import type { NextPage } from "next";

const IndexPage: NextPage = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh"
      }}
    >
      <ConnectKitButton />
    </div>
  );
};

export default IndexPage;
