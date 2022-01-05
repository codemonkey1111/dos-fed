import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "./Header";
import Welcome from "./Welcome";
import Claim from "./Claim";
import Footer from "./Footer";
import useWeb3Modal from "./hooks/useWeb3Modal";
import Web3 from "web3";
import { RiErrorWarningLine } from "react-icons/ri";

const Root = styled.div`
  max-width: 100vw;
  display: flex;
  min-height: 100vh;
  overflow: hidden;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;
`;

const FooterContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-end;
  margin: 1rem 4rem;
`;

const NetworkContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
`;

const NetworkWarning = styled.div`
  display: flex;
  padding: 0.5rem 1rem;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  min-height: 30px;
  background: #f7f8fa;
  border-radius: 12px;
  color: #717171;
  border: 1px solid #e3e3e3;
`;

const WarningSymbol = styled.div`
  display: flex;
  padding: 0.5rem 0.5rem 0.5rem 0;
  align-items: center;
  justify-content: center;
  color: red;
  font-size: 18px;
`;

export function initWeb3(provider: any) {
  const web3: any = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
}

function Home() {
  const [isClaiming, setIsClaiming] = useState(false);
  // const INITIAL_STATE: IAppState = {
  //   fetching: false,
  //   address: "",
  //   web3: null,
  //   provider: null,
  //   connected: false,
  //   chainId: 1,
  //   networkId: 1,
  //   assets: [],
  //   showModal: false,
  //   pendingRequest: false,
  //   result: null
  // };
  const [address, setAddress] = useState("");
  const [web3, setWeb3] = useState(null);
  const [, setConnected] = useState(false);
  const [, setChainId] = useState(1);
  const [networkId, setNetworkId] = useState(1);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  useEffect(() => {
    async function connect() {
      try {
        if (!provider || provider === undefined) {
          return;
        }

        await subscribeProvider(provider);
        const web3: any = initWeb3(provider);
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        const networkId = await web3.eth.net.getId();
        const chainId = await web3.eth.chainId();

        setWeb3(web3);
        setConnected(true);
        setAddress(address);
        setChainId(chainId);
        setNetworkId(networkId);
        // await getAccountAssets();
      } catch (err) {
        console.error(err);
      }
    }
    connect();
  }, [provider]);

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    // provider.on("close", () => this.resetApp());
    provider.on("accountsChanged", async (accounts: string[]) => {
      setAddress(accounts[0]);
      console.log(accounts[0]);
      console.log("account changed");
      // do this in a less hacky way
      window.location.reload();
      // await getAccountAssets();
    });
    provider.on("chainChanged", async (chainId: number) => {
      // const { web3 } = this.state;
      // do this in a less hacky way
      window.location.reload();
      // @ts-ignore
      const networkId = await web3.eth.net.getId();
      setChainId(chainId);
      setNetworkId(networkId);
      // await getAccountAssets();
    });

    // provider.on("networkChanged", async (networkId: number) => {
    //   // const { web3 } = this.state;
    //   // @ts-ignore
    //   // do this in a less hacky way
    //   window.location.reload(false);
    //   const chainId = await web3.eth.chainId();
    //   // await this.setState({ chainId, networkId });
    //   setChainId(chainId);
    //   setNetworkId(networkId);
    //   // await getAccountAssets();
    // });
  };

  
  const [amount, setAmount] = useState('-1');
  const [proof, setProof] = useState([]);
  const [index, setIndex] = useState(0);
  const [isClaimed, setIsClaimed] = useState(false);
  const [addressDNE, setAddressDNE] = useState(false);

  return (
    <Root>
      <Header
        provider={provider}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        address={address}
        setIsClaiming={setIsClaiming}
      />
      {networkId !== 1 && (
        <NetworkContainer>
          <NetworkWarning>
            <WarningSymbol>
              <RiErrorWarningLine />
            </WarningSymbol>
            Please change your network to Ethereum Mainnet
          </NetworkWarning>
        </NetworkContainer>
      )}
      {isClaiming ? (
        <Claim
          provider={provider}
          web3={web3}
          address={address}
          amount={amount}
          proof={proof}
          isClaimed={isClaimed}
          index={index}
          addressDNE={addressDNE}
          setIsClaimed={setIsClaimed}
        />
      ) : (
        <Welcome
          setIsClaiming={setIsClaiming}
          provider={provider}
          address={address}
          setAmount={setAmount}
          setIndex={setIndex}
          //@ts-ignore
          setProof={setProof}
          setIsClaimed={setIsClaimed}
          setAddressDNE={setAddressDNE}
        />
      )}
      <FooterContainer>
        <Footer />
      </FooterContainer>
    </Root>
  );
}

export default Home;
