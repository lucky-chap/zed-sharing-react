/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React from "react";
import styled from "styled-components";
import Text from "./Text";

const Wrapper = styled.div`
  box-sizing: border-box;
  background-color: #111827;
  height: 80px;
  width: 100%;
  padding: 16px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Footer = (): React.ReactElement => {
  return (
    <Wrapper>
      <a
        href="https://townhall.hashnode.com/build-with-linode-hackathon-june-2022"
        target="_blank"
        rel="noreferrer"
      >
        <Text
          content="This project was built for the Hashnode and Linode Hackathon in June 2022"
          lineHeight="24px"
          color="#9ca3af"
        />
      </a>
    </Wrapper>
  );
};

export { Footer };
