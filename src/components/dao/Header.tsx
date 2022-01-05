import React from 'react';
import {
  Link,
} from 'dva/router';
import styled, { keyframes } from "styled-components";
import ellipsis from "../../assets/ellipsis.png";
import SettingsPopup from "./SettingsPopup";
import WalletButton from "./WalletButton";
import logo from "../../assets/GASDAOTRANSPARENT.png";

const HeaderContainer = styled.div`
  width: 100vw;
  align-items: stretch;
`;

const HeaderOptions = styled.div`
  padding: 2rem 1rem;
  min-height: 2.75rem;
  display: flex;
  align-items: center;
  @media only screen and (min-width: 728px) {
    padding: 2rem 4rem;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-start;
`;

const SettingsContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const wiggle = keyframes`
  from {transform:rotate(0deg);}
  to {transform:rotate(10deg);}
`;

const reverse = keyframes`
  from {transform:rotate(10deg);}
  to {transform:rotate(0deg);}
`;

const LogoIcon = styled.div`
  cursor: pointer;
  font-size: 40px;
  animation: ${reverse} 0.5s;
  color: #107cf1;
  &:hover {
    animation: ${wiggle} 0.5s;
    animation-fill-mode: forwards;
  }
`;

const Settings = styled.button`
  height: 38px;
  width: 42px;
  border-radius: 12px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 2rem;
  border: 1px solid #fff;
  &:hover {
    border: 1px solid #c9c9c9;
  }
`;

const Ellipsis = styled.img`
  display: flex;
  height: 25px;
  width: 25px;
`;

export interface Props {
  provider: (() => Promise<void>) | undefined;
  loadWeb3Modal: (() => Promise<void>) | undefined;
  logoutOfWeb3Modal: (() => Promise<void>) | undefined;
  address: string;
  setIsClaiming: (isClaiming: boolean) => void;
}

function Header(props: Props) {
  return (
    <HeaderContainer>
      <HeaderOptions>
        <LogoContainer>
          <LogoIcon onClick={() => props.setIsClaiming(false)}>
            {/* <FaGasPump /> */}
            <img
              style={{ height: "58px", width: "58px" }}
              src={logo}
              alt="settings"
            />
          </LogoIcon>
        </LogoContainer>
        <SettingsContainer>
          <Link to={'/farm'}>Farm</Link>
          <WalletButton
            provider={props.provider}
            loadWeb3Modal={props.loadWeb3Modal}
            logoutOfWeb3Modal={props.logoutOfWeb3Modal}
            address={props.address}
          />
          <SettingsPopup
            trigger={
              <Settings>
                <Ellipsis src={ellipsis} alt="settings" />
              </Settings>
            }
          />
        </SettingsContainer>
      </HeaderOptions>
    </HeaderContainer>
  );
}

export default Header;
