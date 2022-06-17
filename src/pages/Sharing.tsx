/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  CheckCircleOutlineRounded,
  FileCopyOutlined,
  People,
  Person,
  PortableWifiOff,
  WifiTethering,
} from "@material-ui/icons";

import { observer } from "mobx-react-lite";
import RoomService from "../services/RoomService";
import SendIllustration from "../assets/illustrations/plane.png";

const Wrapper = styled.div`
  display: flex;
  height: 90%;
  @media screen and (min-width: 960px) {
    align-items: center;
    justify-content: center;
  }
`;

const Container = styled.div`
  height: fit-content;
  width: 1024px;
  padding: 32px;
  border: 1px solid rgba(42, 42, 46, 1);
  background-color: rgba(12, 12, 13, 1);
  border-radius: 8px;
`;

const ActionAndContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 500px;
  @media screen and (min-width: 960px) {
    flex-direction: row;
  }
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 48px 0;
  @media screen and (min-width: 960px) {
    margin: 0 48px 0 0;
    width: 60%;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media screen and (min-width: 960px) {
    width: 50%;
  }
`;

const RoomLinkContainer = styled.div`
  margin-bottom: 12px;
`;

const RoomLinkActionContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
`;

const RoomLink = styled.input`
  padding: 8px 12px;
  border-radius: 8px;
  width: 100%;
  margin-right: 8px;
  background: transparent;
  color: white;
  border: 1px solid rgba(42, 42, 46, 1);
  font-size: 14px;
`;

const CopyLink = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 8px;
  &:hover {
    background-color: #e91e63;
    transition: 0.3s;
  }
  &:active {
    transform: scale(0.8);
  }
`;

const Heading = styled.div``;

const Illustration = styled.img<{ enlarge: boolean }>`
  margin-top: 32px;
  height: ${({ enlarge }) => {
    return enlarge ? "250px" : "170px";
  }};
`;

const CreateNewRoomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CreateNewRoomButtonWrapper = styled.div`
  margin-top: 24px;
`;

const StatusesWrapper = styled.div`
  margin-bottom: 12px;
`;

const StatusesActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid rgba(42, 42, 46, 1);
  border-radius: 8px;
  margin-top: 4px;
`;

const WebRTCStatusWrapper = styled.div`
  display: flex;
  align-items: center;
  span {
    margin-right: 12px;
  }
`;

const PeerStatusWrapper = styled.div`
  display: flex;
  align-items: center;
  span {
    margin-right: 12px;
  }
`;

const Sharing = () => {
  return "Sh";
};

export default Sharing;
