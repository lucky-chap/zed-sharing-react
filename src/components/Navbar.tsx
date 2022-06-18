import React from "react";
import styled from "styled-components";
// import Text from "./Text";
import Logo from "../assets/icons/github.png";

const Wrapper = styled.div`
  box-sizing: border-box;
  // background-color: #1f2937;
  height: 80px;
  width: 100%;
  padding: 16px 48px;
  display: flex;
  align-items: baseline;
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
      <ZedLogoContainer href="/">
        <Title>Zed</Title>
      </ZedLogoContainer>

      <LogoContainer
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/lucky-chap/zed-sharing-react"
      >
        <img src={Logo} alt="Github icon" width="32px" />
      </LogoContainer>
    </Wrapper>
  );
};

export { Navbar };
