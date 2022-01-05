import React, { useState } from "react";
import styled from "styled-components";
import { Button, Loader } from "semantic-ui-react";
import Web3 from "web3";
import { Shimmer } from "react-shimmer";
import gas from "../../assets/gas.png";
import metamask from "../../assets/metamask.svg";
import { RiCheckboxCircleLine } from "react-icons/ri";

const EOSDaoTokenArtifacts = require("../../abi/abi.json");

const ClaimContainer = styled.div`
  padding: 1rem 1rem;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  @media only screen and (min-width: 930px) {
    padding: 4rem 1rem;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    padding: 8rem 10rem 4rem 10rem;
  }
`;

const ClaimBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const ClaimButton = styled.div`
  margin: 1rem 0 0 0;
  width: 100%;
  justify-content: center;
`;

const Received = styled.div`
  border: 1px solid #e3e3e3;
  border-radius: 1rem;
  margin: 1rem 0;
  padding: 0.5rem 0;
  min-height: 100px;
  display: flex;
  flex-direction: column;
`;

const YouReceived = styled.div`
  color #717171;
  display: flex;
  margin: .75rem 1rem;
  opacity: 0.7;
  align-items: flex-start;
  font-weight: bold;
`;

const YourTokens = styled.div`
  color #000;
  display: flex;
  flex-direction: row;
  margin: 0.75rem 1rem 1.5rem 1rem;
  align-items: flex-start;
  font-weight: bold;
  font-size: 30px;
`;

const ClaimBox = styled.div`
  background: white;
  min-height: 200px;
  flex: 1;
  border-radius: 1rem;
  border: 1px solid #e3e3e3;
  margin: 1rem;
  padding: 2rem;
  min-width: 400px;
  max-width: 500px;
  // offset-x | offset-y | blur-radius | spread-radius | color
  box-shadow: 0 10px 20px 5px rgba(117, 117, 117, 0.1);
  @media only screen and (min-width: 930px) {
    max-width: 34rem;
    margin: 2rem 2rem;
    min-width: 500px;
  }
`;

const ClaimBoxTitle = styled.div`
  // display: flex;
  text-align: left;
  font-size: 25px;
  font-weight: bold;
  margin: 0 0 1rem 0;
  line-height: 1.2;
`;

const ClaimBoxSubtext = styled.div`
  text-align: left;
  margin: 1rem 0;
  line-height: 1.2;
`;

const Icon = styled.img`
  border-radius: 25px;
`;

const IconContainer = styled.div`
  display: flex;
  margin: 0 0.25rem;
  align-items: center;
  justify-content: center;
`;

const LoaderContainer = styled.div`
  display: flex;
  position: relative;
  top: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 20px;
  z-index: 1000;
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

const SuccessSymbol = styled.div`
  display: flex;
  padding: 0.5rem 0.5rem 0.5rem 0;
  align-items: center;
  justify-content: center;
  color: green;
  font-size: 18px;
`;

const AddToken = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #ffa500;
  border-radius: 25px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 1rem;
  margin: 2rem 0;
  cursor: pointer;
  &:hover {
    background-color: #ffb836;
  }
`;

interface Copy {
  title: string;
  firstSubtext: string;
  secondSubtext: string;
  receive: string;
  claimButton: string;
}

const COPY = {
  unconnected: {
    title: "Your wallet is not connected",
    firstSubtext: "Please connect your wallet to continue",
    secondSubtext: "",
    receive: "Connect your wallet to estimate reward",
    claimButton: "Connect Wallet",
  },
  unclaimed: {
    title: "You are eligible for the ΞDOS airdrop",
    firstSubtext: "Claim your tokens below.",
    secondSubtext:
      "You will receive these tokens for being an early participant in the Ethereum community. Use this power wisely!",
    receive: "You will receive...",
    claimButton: "Claim Tokens",
  },
  claimed: {
    title: "Your tokens are claimed!",
    firstSubtext:
      "You were eligible for the DOS airdrop, and you successfully claimed your tokens",
    secondSubtext:
      "You have received these tokens for being an early participant of the Ethereum community. Use this power wisely!",
    receive: "You received...",
    claimButton: "Tokens claimed successfully",
  },
};

interface Props {
  provider: (() => Promise<void>) | undefined;
  web3: object | null;
  index: number;
  address: string;
  amount: string;
  proof: Array<string>;
  isClaimed: boolean;
  addressDNE: boolean;
  setIsClaimed: (isClaimed: boolean) => void;
}

function Claim(props: Props) {
  const loading =
    props.amount === '-1';
  const [isWalletConnected] = useState(
    props.provider !== undefined
  );
  const [claimLoading, setClaimLoading] = useState(false);
  // const [isClaimed, setIsClaimed] = useState(false);
  // set copy for the 3 different user states
  let useCopy: Copy = {
    title: "",
    firstSubtext: "",
    secondSubtext: "",
    receive: "",
    claimButton: "",
  };
  if (!isWalletConnected) {
    useCopy = COPY["unconnected"];
  } else if (props.isClaimed) {
    useCopy = COPY["claimed"];
  } else {
    useCopy = COPY["unclaimed"];
  }

  const claimTokens = async () => {
    try {
      // const KOVAN = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
      const KOVAN = "0x17560c2E702E2B3613e6fBde1d838dC1Aefeb50c";
      // const KOVAN = process.env.REACT_APP_CONTRACT;
      // const MAINET = "";
      const DOS_DAO_TOKEN_ADDRESS = KOVAN;
      setClaimLoading(true);
      // console.log("claim loading");

      var web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_INFURA);

      var DOS = new web3.eth.Contract(
        EOSDaoTokenArtifacts.abi,
        DOS_DAO_TOKEN_ADDRESS
      );
      
      // const to = '0x0a30edefafc469c84a160c6c5510813a4a193372';
      const to = props.address;
      await DOS.methods
        .claim(props.index, to, props.amount, props.proof)
        .send({ from: props.address }, (err: any, data: any) => {
          console.log(err, data);
        })
        .then(console.log);
    } catch (err) {
      console.log(err);
      setClaimLoading(false);
      props.setIsClaimed(false);
    } finally {
      setClaimLoading(false);
      props.setIsClaimed(true);
    }
  };

  const addTokenToMM = async () => {
    try {
      //@ts-ignore
      props.provider.sendAsync({
        method: "metamask_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: "0xc2acf7540f76a3cb389513b7128eb1e4d0d72391", //
            symbol: "DOS", //
            decimals: 18,
            // image: tokenImage,
          },
        },
        id: Math.round(Math.random() * 100000),
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  if (loading) {
    return (
      <ClaimContainer>
        <Shimmer width={350} height={200} />
      </ClaimContainer>
    )
  }

  return (
    <ClaimContainer>
      <ClaimBoxContainer>
        {props.isClaimed && (
          <NetworkContainer>
            <NetworkWarning>
              <SuccessSymbol>
                <RiCheckboxCircleLine />
              </SuccessSymbol>
              Your Tokens were successfully claimed!
            </NetworkWarning>
          </NetworkContainer>
        )}
        {/* <ClaimStatus>You were eligible for the airdrop!</ClaimStatus> */}
        <ClaimBox>
          {props.addressDNE ? (
            <>
              <ClaimBoxTitle>
                Address not eligible for ΞDOS airdrop
              </ClaimBoxTitle>
              <ClaimBoxSubtext>
                #WNGMI
              </ClaimBoxSubtext>
            </>
          ) : loading ? (
            <>
              <Shimmer width={350} height={200} />
            </>
          ) : (
            <>
              <ClaimBoxTitle>{useCopy.title}</ClaimBoxTitle>
              <ClaimBoxSubtext>{useCopy.firstSubtext}</ClaimBoxSubtext>
              <Received>
                <YouReceived> {useCopy.receive}</YouReceived>
                <YourTokens>
                  {loading ? (
                    <Shimmer width={300} height={30} />
                  ) : (
                    <>
                      {parseInt(props.amount, 16) / (10 ** 18)}
                      <IconContainer>
                        <Icon
                          src={gas}
                          alt={"ΞDOS"}
                          style={{ width: "24px", height: "24px" }}
                        />
                      </IconContainer>
                    </>
                  )}
                </YourTokens>
              </Received>
              <ClaimBoxSubtext>{useCopy.secondSubtext}</ClaimBoxSubtext>
              {/* {console.log("claim loading")}
              {console.log(claimLoading)} */}
              <ClaimButton>
                <Button
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    minHeight: "3rem",
                    fontSize: "18px",
                    color: '#005dc2',
                    backgroundColor: '#baceff'
                  }}
                  disabled={props.isClaimed || !isWalletConnected}
                  // onClick={async () => await claimTokens()}
                  onClick={claimTokens}
                >
                  {claimLoading ? (
                    <LoaderContainer>
                      <Loader active size="mini" />
                    </LoaderContainer>
                  ) : (
                    useCopy.claimButton
                  )}
                </Button>
              </ClaimButton>
              {props.isClaimed && (
                <AddToken onClick={addTokenToMM}>
                  <Icon
                    src={metamask}
                    alt={"ΞDOS"}
                    style={{
                      width: "30px",
                      height: "30px",
                      margin: "0 1rem 0 0",
                    }}
                  />
                  Add ΞDOS To Metamask
                </AddToken>
              )}
            </>
          )}
        </ClaimBox>
      </ClaimBoxContainer>
    </ClaimContainer>
  );
}

export default Claim;
