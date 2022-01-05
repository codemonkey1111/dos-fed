import React from 'react';
import styled from "styled-components";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";

const FooterContainer = styled.div`
  width: 100vw;
  font-size: 30px;
  align-items: stretch;
`;

// const FooterContainer = styled.div`
//   font-size: 30px;
//   position: absolute;
//   display: flex;
//   flex-direction: row;
//   right: 2rem;
//   bottom: 2rem;
// `;
const LinkContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  @media only screen and (min-width: 728px) {
    justify-content: flex-end;
  }
`;

const Link = styled.a`
  padding: 0.5rem;
  color: #d3d3d3;
  &:hover {
    color: #808080;
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <LinkContainer>
        {/* <Link href="https://snapshot.org/#/" target="_blank" rel="noreferrer">
          <BsLightningChargeFill />
        </Link> */}
        <Link
          href="https://discord.gg/cYsU9E7q3a"
          target="_blank"
          rel="noreferrer"
        >
          <FaDiscord />
        </Link>
        <Link
          href="https://twitter.com/theeos_dao"
          target="_blank"
          rel="noreferrer"
        >
          <FaTwitter />
        </Link>
        <Link
          href="https://github.com/eosdao"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub />
        </Link>
      </LinkContainer>
    </FooterContainer>
  );
}

export default Footer;
