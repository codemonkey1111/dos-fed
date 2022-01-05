import React from "react";
import styled from "styled-components";
import { Popup } from "semantic-ui-react";
import { FiInfo, FiTwitter } from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";
import { GoBook } from "react-icons/go";

interface PopupProps {
  trigger: React.ReactNode;
}

const Settings = styled.div`
  // position: relative;
  // top: -40px;
  // right: 16px;
  background: #f7f8fa;
  border-radius: 12px;
  border: 1px solid white;
  // padding: 0.5rem;
  width: 11.75rem;
  display: flex;
  flex-direction: column;
`;

const SettingItem = styled.a`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  padding: 0.5rem;
  color: inherit;
  opacity: 0.6;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  &:hover {
    color: inherit;
    opacity: 1;
  }
`;

const Icon = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const SettingsPopup = (props: PopupProps) => (
  <Popup
    on="click"
    pinned
    basic
    trigger={props.trigger}
    position="bottom left"
    offset={[0, 10]}
    style={{
      borderRadius: "12px",
      padding: "0",
      margin: "0 4rem",
      border: "0px solid",
    }}
  >
    <Settings>
      <SettingItem
        href="https://mirror.xyz/daoeos.eth/YQX4zmxsDiJhtJveuNkuIgIA4QOmNCa8nLah23xgzDs"
        target="_blank"
        rel="noreferrer"
      >
        About
        <Icon>
          <FiInfo />
        </Icon>
      </SettingItem>
      <SettingItem
        href="https://discord.gg/cYsU9E7q3a"
        target="_blank"
        rel="noreferrer"
      >
        Discord
        <Icon>
          <FaDiscord />
        </Icon>
      </SettingItem>
      <SettingItem
        href="https://twitter.com/theeos_dao"
        target="_blank"
        rel="noreferrer"
      >
        Twitter
        <Icon>
          <FiTwitter />
        </Icon>
      </SettingItem>
      <SettingItem
        href="https://etherscan.io/address/0xc2acf7540f76a3cb389513b7128eb1e4d0d72391"
        target="_blank"
        rel="noreferrer"
      >
        Contract
        <Icon>
          <GoBook />
        </Icon>
      </SettingItem>
    </Settings>
  </Popup>
);

export default SettingsPopup;
