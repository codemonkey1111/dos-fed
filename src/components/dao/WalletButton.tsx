import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { initWeb3 } from "./Home";

const Button = styled.button`
  font-family: "Inter";
  min-width: 150px;
  font-weight: 500;
  margin: 0 1rem;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  margin: 0 1rem;
  border: 1px solid #fff;
  color: #005dc2;
  background-color: #baceff;
  &:hover {
    border: 1px solid #c9c9c9;
  }

  ${(props) => props.hidden && "hidden"} :focus {
    border: none;
    outline: none;
  }
`;

export interface WalletButtonProps {
  provider: (() => Promise<void>) | undefined;
  loadWeb3Modal: (() => Promise<void>) | undefined;
  logoutOfWeb3Modal: (() => Promise<void>) | undefined;
  address: string;
}

function WalletButton({
  provider,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  address,
}: WalletButtonProps) {
  const [account, setAccount] = useState("");
  const [rendered, setRendered] = useState("");

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (!provider || provider === undefined) {
          return;
        }
        const web3 = initWeb3(provider);
        // Load the user's accounts.
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        if (address) {
          setAccount(address);
        }

        // Render either the ENS name or the shortened account address.
        setRendered(account.substring(0, 6) + "..." + account.substring(36));
      } catch (err) {
        setAccount("");
        setRendered("");
        console.error(err);
      }
    }
    fetchAccount();
  }, [account, provider, setAccount, setRendered]);

  return (
    <>
      {loadWeb3Modal !== undefined && logoutOfWeb3Modal !== undefined && (
        <Button
          onClick={() => {
            if (!provider) {
              loadWeb3Modal();
            } else {
              logoutOfWeb3Modal();
            }
          }}
        >
          {rendered === "" && "Connect Wallet"}
          {rendered !== "" && rendered}
        </Button>
      )}
    </>
  );
}
export default WalletButton;
