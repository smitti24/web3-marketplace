import React from "react";
import { useMetamask, useAddress, useDisconnect } from "@thirdweb-dev/react";

type Props = {};

function Header({}: Props) {
  const connectWithMetaMask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    <div>
      <nav>
        <div>
          {address ? (
            <button className="button-main" onClick={disconnect}>
              Hi, {address.slice(0, 5) + "..." + address.slice(-4)}
            </button>
          ) : (
            <button className="button-main" onClick={connectWithMetaMask}>
              Connect your wallet
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
