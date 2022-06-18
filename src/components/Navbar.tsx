/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React from "react";
import styled from "styled-components";
// import Text from "./Text";
import Logo from "../assets/icons/plane.png";
import GitHubLogo from "../assets/icons/github.png";

const Wrapper = styled.div`
  box-sizing: border-box;
  // background-color: #1f2937;
  height: 80px;
  width: 100%;
  padding: 16px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ZedLogoContainer = styled.a`
  text-decoration: none;
  color: white;
`;

const LogoContainer = styled.a``;

const Title = styled.span`
  font-size: 32px;
  font-weight: 400;
  margin-left: 6px;
`;

const Navbar = (): React.ReactElement => {
  return (
    <Wrapper>
      <LogoContainer
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/lucky-chap/zed-sharing-react"
      >
        <img src={Logo} alt="Github icon" width="50px" />
      </LogoContainer>

      <LogoContainer
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/lucky-chap/zed-sharing-react"
      >
        <img src={GitHubLogo} alt="Github icon" width="22px" />
      </LogoContainer>
    </Wrapper>
  );
};

export { Navbar };
