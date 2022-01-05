import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import Countdown from 'react-countdown';
import Header from "../../components/dao/Header";
import Footer from "../../components/dao/Footer";
import useWeb3Modal from "../../components/dao/hooks/useWeb3Modal";
import Web3 from "web3";
import BigNumber from 'bignumber.js'
import bng from '../../assets/GASDAOTRANSPARENT.png'
import { RiErrorWarningLine } from "react-icons/ri";
import { InputNumber, message, Modal, Slider } from "antd";
import Notify from "bnc-notify"
const lpABI = require("../../abi/lp.json");
const pool2Abi = require("../../abi/pool.json");
const routerAbi = require("../../abi/unirouter.json");

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

const FarmWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`
const FarmOperation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FarmOperationItem = styled.div`
  background: #baceff;
  border: 1px solid #005dc2;
  border-radius: 12px;
  box-shadow: rgb(123 41 41) 1px 1px 0px inset;
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  overflow: hidden;
  width: 300px;
  justify-content: center;
  align-items: center;
  padding: 24px;
  margin-right: 20px;
`;

const FarmOperationImg = styled.img`
  width: 88px;
  height: 88px;
  margin: 24px 0;
`

const FarmOperationLabel = styled.label`
  color: rgb(250, 250, 250);
  font-size: 36px;
  font-weight: 700;
`

const FarmOperationSubLabel = styled.label`
  color: rgb(255, 232, 232);
`
const ButtonWrapper = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: space-between;
  margin-top: 48px;
  width: 100%;
  align-items: center;
`

const DisabledButton = styled.button`
  -webkit-box-align: center;
  align-items: center;
  overflow: hidden;
  background-color: #baceff;
  border: 1px solid #005dc2;
  border-radius: 12px;
  color: rgba(0, 93, 154, 0.333);
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  height: 56px;
  -webkit-box-pack: center;
  justify-content: center;
  outline: none;
  padding-left: 24px;
  padding-right: 24px;
  pointer-events: none;
  width: 100%;
`

const Button = styled.button`
  -webkit-box-align: center;
  align-items: center;
  overflow: hidden;
  background-color: #baceff;
  border: 1px solid #005dc2;
  border-radius: 12px;
  color: #005dc2;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  height: 56px;
  -webkit-box-pack: center;
  justify-content: center;
  outline: none;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
`
const Exit = styled.button`
  -webkit-box-align: center;
  align-items: center;
  overflow: hidden;
  background-color: #baceff;
  border: 1px solid #005dc2;
  border-radius: 12px;
  color: #005dc2;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  height: 56px;
  -webkit-box-pack: center;
  justify-content: center;
  outline: none;
  padding-left: 24px;
  padding-right: 24px;
  width: 300px;
  margin-top: 20px;
`
const StakeButton = styled.button`
  -webkit-box-align: center;
  align-items: center;
  overflow: hidden;
  background-color: #baceff;
  border: 1px solid #005dc2;
  border-radius: 12px;
  color: #005dc2;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  height: 56px;
  -webkit-box-pack: center;
  justify-content: center;
  outline: none;
  padding-left: 24px;
  padding-right: 24px;
  width: 100px;
`

const DepositEthWrapper = styled.div`
  margin: 24px 0;
  border: 1px solid #005dc2;
  border-radius: 12px;
  padding: 16px;
`
const DepositEthInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const notify = Notify({
  dappId: 'dcc20d17-0e12-41e2-98f2-15638bef6241',       // [String] The API key created by step one above
  networkId: 1  //
});

let globalWeb3: any = null;
let globalAddress: any = null;

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

  globalWeb3 = web3;

  return web3;
}

function Home() {
  const [, setIsClaiming] = useState(false);
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
  const [lpContract, setLpContract] = useState(null);
  const [poolContract, setPoolContract] = useState(null);
  const [routerContract, setRouterContract] = useState(null);
  const [, setConnected] = useState(false);
  const [, setChainId] = useState(1);
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const [stakeLp, setStakeLp] = useState(new BigNumber(0));
  const [rewards, setRewards] = useState(new BigNumber(0));
  const [lpAmount, setLpAmount] = useState(new BigNumber(0));
  const [stakeInput, setStakeInput] = useState(0);
  const [unStakeInput, setUnStakeInput] = useState(0);
  const [stakeVisible, setStakeVisible] = useState(false);
  const [unStakeVisible, setUnStakeVisible] = useState(false);
  const [eth, setEth] = useState(0);
  const [slippage, setSlippage] = useState(5);
  const [apy, setApy] = useState(0);

  const [networkId, setNetworkId] = useState(1);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  const lpAddr = '0x4c053c1cd9047263e70c9f731691aead7a56be94';
  // const lpAddr = '0xc28c4e511db16a0b7510bc3140dded1426962156'; // goerli
  const poolAddr = '0x5251fF06Fc6EfA30AdA0e5560CA907AeE023Fb69';
  // const poolAddr = '0xeB3C085FBc1030bb127114CB1A3B9A02A24eF62d'; // goerli
  const uniswapRouterAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  const DOSAddr = '0xc2acf7540f76a3cb389513b7128eb1e4d0d72391';
  const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  const onlineTime = new Date(1641398400000);

  if (new Date().getTime() < 1641398400000) {
    return (
      <div>
        <Header
          provider={provider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          address={address}
          setIsClaiming={setIsClaiming}
        />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 80,
          justifyContent: 'center',
          fontSize: 40,
          color: '#005dc2'
        }}>
          <Countdown date={onlineTime} />
        </div>
      </div>
    )
  }

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
        globalAddress = address;

        const tempLpContract = new web3.eth.Contract(
          lpABI.abi,
          lpAddr
        );

        const tempPoolContract = new web3.eth.Contract(
          pool2Abi.abi,
          poolAddr
        );

        const tempRouterContract = new web3.eth.Contract(
          routerAbi,
          uniswapRouterAddr
        );

        setLpContract(tempLpContract);
        setPoolContract(tempPoolContract);
        setRouterContract(tempRouterContract);
        // await getAccountAssets();
        fetchBalance(address);
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
  };

  useEffect(() => {
    if (address) {
      if (lpContract) {
        fetchAllowance();
        fetchLpAmount();
      }

      if (poolContract) {
        fetchRewards();
        fetchStakeLp();
      }
    }
  }, [address, lpContract, poolContract])

  useEffect(() => {
    if (lpContract && poolContract && routerContract) {
      fetchApy();
    }
  }, [routerContract, lpContract, poolContract])


  const fetchBalance = async (address: string) => {
    // @ts-ignore
    (globalWeb3).eth.getBalance(address).then((balance: any) => {
      console.log(balance, 'balance');
      setEth(+new BigNumber(balance).dividedBy(10 ** 18).toFixed(2));
    })
  }

  const fetchRewards =async () => {
    // @ts-ignore
    poolContract.methods
      .earned(globalAddress)
      .call()
      .then((amount: any) => {
        setRewards(new BigNumber(amount));
      });
  }

  const fetchStakeLp = async () => {
    // @ts-ignore
    poolContract.methods
      .balanceOf(globalAddress)
      .call()
      .then((amount: any) => {
        setStakeLp(new BigNumber(amount));
        setUnStakeInput(new BigNumber(amount).dividedBy(10 ** 18).toNumber());
      });
  }

  const fetchLpAmount = async () => {
    // @ts-ignore
    lpContract.methods
      .balanceOf(globalAddress)
      // .balanceOf('0x6cd941a53402a9cad5991cdbe7839d362f8e61c6')
      .call()
      .then((amount: any) => {
        setLpAmount(new BigNumber(amount));
        setStakeInput(new BigNumber(amount).div(10 ** 18).toNumber())
      });
  }

  // const fetchApy = async () => {
  //   // @ts-ignore
  //   const reserveData = await lpContract.methods
  //     .getReserves()
  //     .call();
  //   const { reserve0 } = reserveData;
  //   // @ts-ignore
  //   const totalSupply = await lpContract.methods
  //     .totalSupply()
  //     .call();

  //   const lpPrice = new BigNumber(reserve0).multipliedBy(2)
  //   .dividedBy(new BigNumber(totalSupply));
  //   // @ts-ignore
  //   const totalStake = await poolContract.methods
  //     .totalSupply()
  //     .call();
    
  //   const tempApy = new BigNumber(totalStake).multipliedBy(lpPrice)
  //   .multipliedBy(52)
  //   .dividedBy(10** 18);
  //   setApy(tempApy.toNumber()* 100);
  // }

  const fetchApy = async () => {
    // @ts-ignore
    const reserveData = await lpContract.methods
      .getReserves()
      .call();
    const { reserve0 } = reserveData;
    // @ts-ignore
    const totalSupply = await lpContract.methods
      .totalSupply()
      .call();

    const lpPrice = new BigNumber(reserve0).multipliedBy(2)
      .dividedBy(new BigNumber(totalSupply))
      // .dividedBy(1e18);
    // @ts-ignore
    const totalStake = await poolContract.methods
      .totalSupply()
      .call();
    // @ts-ignore
    let rewardRate = await poolContract.methods
      .rewardRate()
      .call();

    rewardRate = new BigNumber(rewardRate);
    
    // @ts-ignore
    let dosPrice = await routerContract.methods
      .getAmountsOut(new BigNumber(1e18), [DOSAddr, WETH])
      .call();
    
    dosPrice = dosPrice[dosPrice.length - 1];
    const tempApy = (((rewardRate)
    .multipliedBy(new BigNumber(dosPrice).multipliedBy(1e18 * 7 * 24 * 60 * 60)))
    .dividedBy(new BigNumber(totalStake).multipliedBy(new BigNumber(lpPrice))))
    .multipliedBy(52)
    .dividedBy(1e34);
    setApy(tempApy.toNumber());
  }


  const fetchAllowance = async () => {
    // @ts-ignore
    lpContract.methods
      .allowance(globalAddress, poolAddr)
      .call()
      .then((a: any) => {
        setAllowance(new BigNumber(a));
      });
        // props.setIsClaiming(false);
  }

  const depositEth = async () => {
    let maxPrice = new BigNumber(0);
    // @ts-ignore
    const reserveData = await lpContract.methods
      .getReserves()
      .call();
    
    const { reserve0, reserve1 } = reserveData;
    maxPrice = new BigNumber(reserve0).dividedBy(new BigNumber(reserve1))
    maxPrice = maxPrice.multipliedBy(new BigNumber(1 + slippage / 100))
      .multipliedBy(new BigNumber(10 ** 18));
    // @ts-ignore
    poolContract.methods
      // .balanceOf(address)
      .autoStakeETHPool2(new BigNumber(maxPrice).multipliedBy(new BigNumber(10).pow(18)))
      .send({ from: address, value: new BigNumber(eth).multipliedBy(new BigNumber(10 ** 18)) }, (err: any, data: any) => {
        if (!err) {
          const { emitter } = notify.hash(data);
          emitter.on('all', (data: any) => {
            const { status } = data;
            if (status === 'confirmed') {
              fetchBalance(globalAddress);
              fetchStakeLp();
              fetchRewards();
            }
            if (status !== 'pending') {
              setStakeVisible(false);
            }
          })
          return;
        }
        message.error('stake error');
      })
      .then(console.log);
  }

  const approve = async () => {
    // setApproveLoading(true);
    // @ts-ignore
    lpContract.methods
      // .balanceOf(address)
      .approve(poolAddr, ethers.constants.MaxUint256.toString())
      .send({ from: address }, (err: any, data: any) => {
        if (!err) {
          const { emitter } = notify.hash(data);
          emitter.on('all', (data: any) => {
            const { status } = data;
            if (status === 'confirmed') {
              fetchAllowance();
            }
            if (status !== 'pending') {
              // setApproveLoading(false);
            }
          })
          return;
        }
        // setApproveLoading(false);
        message.error('approve error');
      })
      .then(console.log);
  }

  const stake = async () => {
    // @ts-ignore
    poolContract.methods
      // .balanceOf(address)
      .stakePool2(new BigNumber(stakeInput).multipliedBy(new BigNumber(10).pow(18)))
      .send({ from: address }, (err: any, data: any) => {
        console.log(err, data);
        if (!err) {
          const { emitter } = notify.hash(data);
          emitter.on('all', (data: any) => {
            const { status } = data;
            if (status === 'confirmed') {
              fetchStakeLp();
              fetchLpAmount();
            }
            if (status !== 'pending') {
              setStakeVisible(false);
            }
          })
          return;
        }
        message.error('stake error');
      })
      .then(console.log);
  }
  
  const unStake = async () => {
    // setStakeLoading(true);
    // @ts-ignore
    poolContract.methods
      // .balanceOf(address)
      .withdrawAndClaimPool2(new BigNumber(unStakeInput).times(new BigNumber(10).pow(18)))
      .send({ from: address }, (err: any, data: any) => {
        console.log(data);
        if (!err) {
          const { emitter } = notify.hash(data);
          emitter.on('all', (data: any) => {
            const { status } = data;
            if (status === 'confirmed') {
              fetchStakeLp();
              fetchLpAmount();
            }
            if (status !== 'pending') {
              // setUnstakeLoading(false);
              setUnStakeVisible(false);
            }
          })
          return;
        }
        message.error('unStake error');
      })
      .then(console.log);
  }

  const harvest = async () => {
    // @ts-ignore
    poolContract.methods
      // .balanceOf(address)
      .getRewardDOS()
      .send({ from: address }, (err: any, data: any) => {
        if (!err) {
          const { emitter } = notify.hash(data);
          emitter.on('all', (data: any) => {
            const { status } = data;
            if (status === 'confirmed') {
              fetchRewards();
            }
            if (status !== 'pending') {
              // setUnstakeLoading(false);
              setUnStakeVisible(false);
            }
          })
          return;
        }
        message.error('harvest error');
      })
      .then(console.log);
  }

  const exit = async () => {
    // @ts-ignore
    poolContract.methods
      // .balanceOf(address)
      .exitPool2()
      .send({ from: address }, (err: any, data: any) => {
        if (!err) {
          const { emitter } = notify.hash(data);
          emitter.on('all', (data: any) => {
            const { status } = data;
            if (status === 'confirmed') {
              fetchStakeLp();
              fetchLpAmount();
              fetchRewards();
            }
            if (status !== 'pending') {
              // setUnstakeLoading(false);
              setUnStakeVisible(false);
            }
          })
          return;
        }
        message.error('exit error');
      })
      .then(console.log);
  }

  return (
    <Root>
      <div>
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
        <FarmWrapper>
          <h1>Eternal Lands</h1>
          <h4>
            Deposit ETH and earn DOS
          </h4>
          <DepositEthWrapper>
            <DepositEthInput>
              <InputNumber
                style={{ height: 40, marginRight: 20 }}
                value={eth}
                onChange={(e) => {
                  setEth(e || 0);
                }}
              />
              <StakeButton onClick={depositEth}>
                Deposit
              </StakeButton>
            </DepositEthInput>
            <div style={{ display: 'flex', alignItems: 'center'}}>
              Slippage
              <Slider
                tipFormatter={(value: any) => `${value}%`}
                defaultValue={5}
                style={{ width: 200 }}
                max={10}
                min={1}
                value={slippage}
                onChange={(e: any) => {
                  console.log('e', e);
                  setSlippage(e);
                }}
              />
            </div>
          </DepositEthWrapper>
          <h4>Deposit <a href="https://app.uniswap.org/#/add/v2/ETH/0xc2acf7540f76a3cb389513b7128eb1e4d0d72391" target="_blank">UNI_LP</a> and earn DOS</h4>
          <h3 style={{ margin: 10 }}>
            apy {apy}%
          </h3>
          <FarmOperation>
            <FarmOperationItem>
              <FarmOperationImg
                src={bng}
              />
              <FarmOperationLabel>
                {rewards.div(10 ** 18).toNumber().toFixed(2)}
              </FarmOperationLabel>
              <FarmOperationSubLabel>
                DOSs earned
              </FarmOperationSubLabel>
              <ButtonWrapper>
                {
                  !rewards.toNumber()
                  ? (
                      <DisabledButton>
                        Harvest
                      </DisabledButton>
                  )
                  : (
                    <Button onClick={harvest}>
                      Harvest
                    </Button>
                  )
                }
              </ButtonWrapper>
            </FarmOperationItem>
            <FarmOperationItem>
              <FarmOperationImg
                src={bng}
              />
              <FarmOperationLabel>
                {stakeLp.div(10 ** 18).toNumber().toFixed(2)}
              </FarmOperationLabel>
              <FarmOperationSubLabel>
                UNI_LP Staked
              </FarmOperationSubLabel>
              {
                !!allowance.toNumber()
                  ? (
                    <ButtonWrapper>
                      <StakeButton onClick={() => {
                        setUnStakeVisible(true);
                      }}>
                        unStake
                      </StakeButton>
                      <StakeButton onClick={() => {
                        setStakeVisible(true);
                      }}>
                        stake
                      </StakeButton>
                    </ButtonWrapper>
                  )
                  : (
                    <ButtonWrapper>
                      <Button onClick={approve}>
                        Approve UNI_LP
                      </Button>
                    </ButtonWrapper>
                  )
              }

            </FarmOperationItem>
          </FarmOperation>
          {
            !!stakeLp.toNumber()
            ? (
                <Exit onClick={exit}>
                  Harvest & Withdraw
                </Exit>
            )
            : null
          }
        </FarmWrapper>
        <FooterContainer>
          <Footer />
        </FooterContainer>
        <Modal
          title={null}
          footer={null}
          visible={stakeVisible}
          onOk={() => {
            setStakeVisible(false)
          }}
          onCancel={() => {
            setStakeVisible(false)
          }}
        >
          <ButtonWrapper>
            <InputNumber
              style={{ width: 340, height: 40 }}
              value={stakeInput}
              min={0}
              max={+lpAmount.toNumber().toFixed(4)}
              onChange={(e) => {
                setStakeInput(e || 0);
              }}
            />
            <StakeButton onClick={stake}>
              stake
            </StakeButton>
          </ButtonWrapper>
        </Modal>
        <Modal
          title={null}
          footer={null}
          visible={unStakeVisible}
          onOk={() => {
            setUnStakeVisible(false)
          }}
          onCancel={() => {
            setUnStakeVisible(false)
          }}
        >
          <ButtonWrapper>
            <InputNumber
              style={{ width: 340, height: 40 }}
              value={unStakeInput}
              min={0}
              max={+stakeLp.toNumber().toFixed(4)}
              onChange={(e) => {
                setUnStakeInput(e || 0);
              }}
            />
            <StakeButton onClick={unStake}>
              unStake
            </StakeButton>
          </ButtonWrapper>
        </Modal>
      </div>
    </Root>
  );
}

export default Home;
