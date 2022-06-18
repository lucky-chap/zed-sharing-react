import React from "react";
import { CircularProgress } from "@material-ui/core";
import styled from "styled-components";

import Text from "../Text";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  margin-top: 24px;
`;

interface IProps {
  content: string | undefined;
}

const LoadingState = (props: IProps): React.ReactElement => {
  const { content } = props;

  return (
    <Wrapper>
      <CircularProgress style={{ color: "#0ea5e9" }} />
      <ContentWrapper>
        <Text content={content || ""} color="#eee" />
      </ContentWrapper>
    </Wrapper>
  );
};

export { LoadingState };
