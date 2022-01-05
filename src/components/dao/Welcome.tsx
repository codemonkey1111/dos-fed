import React from 'react';

import styled from "styled-components";
// import { FaArrowRight } from "react-icons/fa";
import Web3 from "web3";
import {
  fetchClaim
} from '@/services/token';

import logo from "../../assets/GASDAOTRANSPARENT.png";
import { FaArrowRight } from 'react-icons/fa';
const EOSDaoTokenArtifacts = require("../../abi/abi.json");

export const ConnectButton = styled.button`
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
  &:disabled {
    opacity: 0.5;
    border: 1px solid #fff;
    cursor: not-allowed;
  }
`;

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem;
  justify-content: center;
  align-items: center;
  @media only screen and (min-width: 728px) {
    padding: 2rem 1rem;
  }
`;

const WelcomeItems = styled.div`
  max-width: 500px;
`;

const Logo = styled.div`
  font-size: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #107cf1;
  // padding: 1rem;
  margin: 3rem;
`;

const InfoLinkContainer = styled.div`
  margin: 1rem;
`;
const InfoLink = styled.a`
  color: #9e9e9e;
  font-weight: 800;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    color: #5e5e5e;
  }
`;

const Title = styled.div`
  font-size: 44px;
  font-weight: bold;
  line-height: 1.2;
  margin: 1rem;
  color: #107cf1;
`;

const Subtext = styled.div`
  font-size: 18px;
  color: #717171;
  line-height: 1.5;
  margin: 1rem;
  text-align:left;
`;

interface Props {
  setIsClaiming: (isClaiming: boolean) => void;
  provider: (() => Promise<void>) | undefined;
  address: string;
  setAmount: (amount: string) => void;
  setIndex: (index: number) => void;
  setProof: (proof: Array<string>) => void;
  setIsClaimed: (isClaimed: boolean) => void;
  setAddressDNE: (dne: boolean) => void;
}

function Welcome(props: Props) {
  async function fetchState() {
    // auth(process.env.REACT_APP_UPSTASH, process.env.REACT_APP_UPSTASH_KEY);

    const EOS_DAO_TOKEN_ADDRESS = '0x17560c2E702E2B3613e6fBde1d838dC1Aefeb50c';

    var web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_INFURA);

    var contract = new web3.eth.Contract(
      EOSDaoTokenArtifacts.abi,
      EOS_DAO_TOKEN_ADDRESS
    );

    // fetchClaim('0x0a30edefafc469c84a160c6c5510813a4a193372').then((result: any) => {

    fetchClaim(props.address).then((result: any) => {
      // address: "0x0000b2D9F4a1F617D52c61B3dbBE824bb8962E88"
      // airdrop: "1734654402951629599556327"
      // count: 2425
      // eth: 4.41330225
      // lastBlock: 13453798
      // proof: (10) ['0x565825f1c2153f459f37052e41a32a0c0f11458c66f2801e46d0caafc4f133a1', '0xf2330498180b07c704679c07b194be383d5bb08c5b71bd8f88bb0005e7e352e7', '0xf711196f2c63d17d875f626619f9920e3e6990fd20f818fef061548a7921dc5d', '0xc44702b52bc972c01278fde342486306b50d648b70e389c517e19087223955e7', '0x8ba0a6c30ff9da04ea9174d7f4a8b435ae62b2cba76d9fca9e52ae894dce89e2', '0x5f50edab38a238c285e6594925a1de8b0caed82ac2ce584c9d130e6fec73301c', '0x824c9b98a3815bc08515a72ab278994b7208e22367d75f754c79286c5bdd87da', '0x4d8747169c904e61b32db9f48405a8504bcfe462cf6f0b9a24299fe258af834b', '0x983802bc8542cc9719a80b6e38d84b5c9ef816f108d3ce19864b18819ca0e15e', '0x77b97422e25da0e2bb4aee03ef2e81626392ca92af91b68ec57c4aeec48f25a4']
      // tokens: 1734654.4029516296
      // usd: 4799.39782139
      //
      let data = result;
      if (data == null) {
        console.log("address DNE");
        props.setAddressDNE(true);
        props.setAmount('0');
      } else {
        const { amount, proof, index } = data;
        // props.setGasSpentEth(Number(eth).toFixed(4));
        props.setAmount(amount);
        props.setProof(proof);
        props.setIndex(index);
        contract.methods
          .isClaimed(index)
          .call()
          .then((hasClaimed: any) => props.setIsClaimed(hasClaimed));
        // props.setIsClaiming(false);
        console.log(data);
      }
    });
    // setGasSpentEth();
    props.setIsClaiming(true);
  }

  //@ts-ignore
  function creat_datasets(label, data, line_color, background_color) {
    return {
      label: label,
      steppedLine: false,
      data: data,
      borderColor: line_color,
      fill: 'origin',
      backgroundColor: background_color
    }
  }

  window.onload = function () {
    let chartColors = {
      blue: "rgb(54, 162, 235)",
      green: "rgb(75, 192, 192)",
      orange: "rgb(255, 159, 64)",
      red: "rgb(255, 99, 132)",
      yellow: "rgb(255, 205, 86)",
    }


    // @ts-ignore
    let ctx = document.getElementById("pieChart")?.getContext("2d");
    // @ts-ignore
    var myPieChart = new Chart(ctx, {
      type: "pie",
      data: {
        datasets: [{
          steppedLine: true,
          fill: 'origin',
          backgroundColor: [chartColors.blue, chartColors.yellow, chartColors.green],
          data: [874878380, 100000000, 25121620],
        }],
        labels: ['EOS Genesis Airdrop 87.5%', 'Liquidity Farming 10%', 'Devs 2.5%'],
      },
      options: {
        title: {
          display: true,
          fontSize: 20,
          text: '$DOS Token Distribution for EOSDAO',
        },
        legend: {
          display: true,
          position: 'bottom',
        },
        cutoutPercentage: 50,
        animation: {
          animateRotate: true,
          animateScale: true,
        },
      }
    });

  }

  return (
    <WelcomeContainer>
      <WelcomeItems>
        <Logo>
          {/* <FaGasPump /> */}
          <img
            style={{ height: "250px", width: "250px" }}
            src={logo}
            alt="settings"
          />
          {/* logo */}
        </Logo>
        <InfoLinkContainer>
          <InfoLink
            href="https://mirror.xyz/daoeos.eth/YQX4zmxsDiJhtJveuNkuIgIA4QOmNCa8nLah23xgzDs"
            target="_blank"
            rel="noreferrer"
          >
            Introducing ΞDOS <FaArrowRight style={{ fontSize: "12px" }} />
          </InfoLink>
        </InfoLinkContainer>
        <Title>Make EOS great again</Title>
        <Subtext>
          <b>ΞDOS</b> is the governance token of The governance token for the <b>ΞEOS DAO</b>, EOS used to be an active community of more than 160,000 token holders in 2018. However due to BlockOne’s inaction and the monopoly of BPs, the EOS ecology has gradually deteriorated in recent years.
        </Subtext>
        <Subtext>
          We hope the EOS genesis members to rebuild our community, use a new infrastructure that is more in line with market needs to build an ecosystem that supports EVM, and develop defi,nft,web3 and metaverse applications based on it.
        </Subtext>
        <Subtext>
          $DOS Token address: 0xc2acf7540f76a3cb389513b7128eb1e4d0d72391
        </Subtext>
        <ConnectButton
          disabled={props.provider === undefined}
          onClick={async () => await fetchState()}
          style={{}}
        >
          {props.provider === undefined
            ? "Connect Wallet to Claim Tokens"
            : "Claim Tokens"}
        </ConnectButton>
      </WelcomeItems>
      <div>
        <div style={{ width: 600, height: 400, marginTop: 20 }}>
          <canvas id="pieChart" width="600" height="400"></canvas>
        </div>
      </div>

    </WelcomeContainer>
  );
}

export default Welcome;
