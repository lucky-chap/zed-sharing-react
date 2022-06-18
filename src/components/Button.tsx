/* eslint-disable no-shadow */
import React from "react";
import styled from "styled-components";

interface ButtonProps {
  width?: string;
  textAlign?: string;
  isDisabled?: boolean;
  backgroundColor?: string;
}

const Wrapper = styled.div<ButtonProps>`
  color: white;
  background-color: #5ea1b8;
  ${({ backgroundColor }) => {
    return (
      backgroundColor &&
      `
      background-color: ${backgroundColor} !important;
    `
    );
  }};
  padding: 16px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all;
  transition-duration: 0.3s;
  width: ${({ width }) => {
    return width;
  }};
  text-align: ${({ textAlign }) => {
    return textAlign;
  }};
  ${({ isDisabled }) => {
    return (
      isDisabled &&
      `
      opacity: 0.6;
      pointer-events: none;
    `
    );
  }};

  ${({ backgroundColor }) => {
    return (
      backgroundColor &&
      `
      &:hover {
    background-color: #5EA1B8 ?? ${({
      backgroundColor,
    }: {
      backgroundColor: string;
    }) => backgroundColor};
    opacity: 0.8;
  }
    `
    );
  }};
`;

interface IProps extends ButtonProps {
  children: string;
  isDisabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  backgroundColor?: string;
}

const Button = (props: IProps): React.ReactElement => {
  const { children, width, textAlign, isDisabled, backgroundColor, onClick } =
    props;

  return (
    <Wrapper
      width={width}
      backgroundColor={backgroundColor}
      textAlign={textAlign}
      isDisabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
    >
      {children}
    </Wrapper>
  );
};

Button.defaultProps = {
  width: "unset",
  textAlign: "center",
  isDisabled: false,
  onClick: null,
  backgroundColor: "#5EA1B8",
};

export default Button;
