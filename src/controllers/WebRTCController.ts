/* eslint-disable security/detect-object-injection */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
import SocketService from "../services/SocketService";
import { webRTCIceServers } from "../config";
import { SOCKET_EVENTS } from "../constants/SocketEvents";
import {
  CANCEL_MESSAGE,
  END_OF_FILE_MESSAGE,
  MAXIMUM_MESSAGE_SIZE,
  META_DATA_CHANNEL_LABEL,
  START_OF_FILE_MESSAGE,
} from "../constants/WebRTC";
import { WebRTCConnectionStatus } from "../types/WebRTC";
import FileStore from "../store/FileStore";

interface ICreateDataChannelParams {
  label: string;
  onOpenHandler?: (event: Event) => void;
  onMessageHandler?: (event: MessageEvent) => void;
  onBufferedAmountLowHandler?: (event: Event) => void;
  onCloseHandler?: (event: Event) => void;
}

class WebRTCController {
  private peerId: string;

  private peerRole: string;

  private webRTCConnection: RTCPeerConnection;

  private dataChannelsMap: { [key: string]: RTCDataChannel } = {};

  // eslint-disable-next-line @typescript-eslint/ban-types
  private sendFileCallbackQueue: Function[] = [];

  private cancelledFilesMap: { [fileHash: string]: boolean } = {};

  constructor() {
    SocketService.registerEvent(
      SOCKET_EVENTS.PEER_JOINED,
      this.handlePeerJoinedEvent
    );
    SocketService.registerEvent(SOCKET_EVENTS.OFFER, this.handleOfferEvent);
    SocketService.registerEvent(SOCKET_EVENTS.ANSWER, this.handleAnswerEvent);
    SocketService.registerEvent(
      SOCKET_EVENTS.ICE_CANDIDATE,
      this.handleIceCandidateEvent
    );
    SocketService.registerEvent(
      SOCKET_EVENTS.PEER_LEFT,
      this.handlePeerLeftEvent
    );
  }

  createWebRTCConnection = (): void => {
    this.webRTCConnection = new RTCPeerConnection(webRTCIceServers);

    this.webRTCConnection.onicecandidate = this.handleICECandidateWebRTCEvent;
    this.webRTCConnection.ondatachannel = this.handleDataChannelWebRTCEvent;
    this.webRTCConnection.onconnectionstatechange =
      this.handleConnectionStateChangeWebRTCEvent;
  };

  createOffer = async (): Promise<RTCSessionDescriptionInit> => {
    return this.webRTCConnection.createOffer();
  };

  createAnswer = async (): Promise<RTCSessionDescriptionInit> => {
    return this.webRTCConnection.createAnswer();
  };

  createDataChannel = ({
    label,
    onOpenHandler,
    onMessageHandler,
    onBufferedAmountLowHandler,
    onCloseHandler,
  }: ICreateDataChannelParams): RTCDataChannel => {
    const dataChannel = this.webRTCConnection.createDataChannel(label);

    if (onOpenHandler) {
      dataChannel.onopen = onOpenHandler;
    }

    if (onMessageHandler) {
      dataChannel.onmessage = onMessageHandler;
    }

    if (onBufferedAmountLowHandler) {
      dataChannel.onbufferedamountlow = onBufferedAmountLowHandler;
    }

    if (onCloseHandler) {
      dataChannel.onclose = onCloseHandler;
    }

    this.dataChannelsMap[label] = dataChannel;
    return dataChannel;
  };

  sendMetadata = (filesObject: { [key: string]: File }): void => {
    const metadata = Object.keys(filesObject).reduce(
      (
        accumulator: { [key: string]: Record<string, string | number> },
        fileHash
      ) => {
        const { name, type, size } = filesObject[fileHash];

        accumulator[fileHash] = { name, type, size };

        return accumulator;
      },
      {}
    );

    this.dataChannelsMap[META_DATA_CHANNEL_LABEL].send(
      JSON.stringify(metadata)
    );
  };

  sendChunk = async (
    file: File,
    offset: number,
    dataChannel: RTCDataChannel
  ): Promise<number> => {
    const chunk = file.slice(offset, offset + MAXIMUM_MESSAGE_SIZE);
    const buffer = await chunk.arrayBuffer();
    if (dataChannel.readyState !== "open") {
      return offset;
    }
    dataChannel.send(buffer);

    return offset + chunk.size;
  };

  handleFileDataChannelOpenWebRTCEvent = (
    _event: Event,
    dataChannel: RTCDataChannel
  ): void => {
    dataChannel.send(START_OF_FILE_MESSAGE);
  };

  handleBufferedAmountLowWebRTCEvent = async (
    _event: Event,
    dataChannel: RTCDataChannel,
    fileHash: string,
    file: File
  ): Promise<void> => {
    const offset = FileStore.filesSendProgress[fileHash];
    if (offset >= file.size) {
      return;
    }

    const newOffset = await this.sendChunk(file, offset, dataChannel);
    FileStore.setFileSendProgress(fileHash, newOffset);

    if (newOffset >= file.size) {
      dataChannel.send(END_OF_FILE_MESSAGE);
      dataChannel.close();
    }
  };

  handleDataChannelCloseWebRTCEvent = (): void => {
    const sendFileCallback = this.sendFileCallbackQueue.shift();
    if (!sendFileCallback) {
      FileStore.setIsSending(false);
      return;
    }

    sendFileCallback();
  };

  sendFiles = (filesObject: { [key: string]: File }): void => {
    Object.keys(filesObject).forEach((fileHash) => {
      if (!FileStore.filesSendProgress[fileHash]) {
        const sendFileCallback = (): void => {
          if (this.cancelledFilesMap[fileHash]) {
            this.handleDataChannelCloseWebRTCEvent();
            return;
          }
          const label = `file-${fileHash}`;
          const file = filesObject[fileHash];

          FileStore.setFileSendProgress(fileHash, 0);

          const dataChannel = this.createDataChannel({
            label,
            onOpenHandler: (event) => {
              return this.handleFileDataChannelOpenWebRTCEvent(
                event,
                dataChannel
              );
            },
            onBufferedAmountLowHandler: (event) => {
              return this.handleBufferedAmountLowWebRTCEvent(
                event,
                dataChannel,
                fileHash,
                file
              );
            },
            onCloseHandler: () => {
              return this.handleDataChannelCloseWebRTCEvent();
            },
          });

          // dataChannel.bufferedAmountLowThreshold = BUFFERED_AMOUNT_LOW_THRESHOLD;
          dataChannel.binaryType = "arraybuffer";
        };

        this.sendFileCallbackQueue.push(sendFileCallback);
      }
    });

    const sendFileCallback = this.sendFileCallbackQueue.shift();
    if (sendFileCallback) {
      FileStore.setIsSending(true);
      sendFileCallback();
    }
  };

  handleFileReceiveWebRTCEvent = async (
    event: MessageEvent,
    dataChannel: RTCDataChannel
  ): Promise<void> => {
    const { data } = event;
    const { label } = dataChannel;
    const fileHash = label.split("-")?.[1];

    if (data === END_OF_FILE_MESSAGE) {
      dataChannel.close();
    } else if (data === START_OF_FILE_MESSAGE) {
      FileStore.clearFileData(fileHash);
      FileStore.setFileReceiveProgress(fileHash, 0);
    } else if (data === CANCEL_MESSAGE) {
      this.cancelReceiverSendOperation(fileHash);
    } else {
      if (data instanceof ArrayBuffer) {
        FileStore.addFileData(fileHash, data);
      } else {
        FileStore.addFileData(fileHash, await data.arrayBuffer());
      }

      const fileReceiveSize =
        FileStore.fileHashToDataMap[fileHash].length *
        FileStore.fileHashToDataMap[fileHash]?.[0].byteLength;

      FileStore.setFileReceiveProgress(fileHash, fileReceiveSize);
    }
  };

  handleMetaDataChannel = (event: MessageEvent) => {
    FileStore.setFileHashToMetadataMap(JSON.parse(event.data));
  };

  cancelReceiverSendOperation = (fileHash: string): void => {
    FileStore.setFileReceiveProgress(fileHash, 0);
    FileStore.clearFileData(fileHash);
  };

  cancelSenderSendOperation = (fileHash: string): void => {
    const dataChannelLabel = `file-${fileHash}`;
    const dataChannel = this.dataChannelsMap[dataChannelLabel];
    FileStore.setFileSendProgress(fileHash, 0);

    this.cancelledFilesMap[fileHash] = true;
    if (dataChannel && dataChannel.readyState === "open") {
      dataChannel.send(CANCEL_MESSAGE);
      dataChannel.close();
    }
  };

  // WebRTC events start

  handleConnectionStateChangeWebRTCEvent = (): void => {
    switch (this.webRTCConnection.connectionState) {
      case "connected":
        FileStore.setWebRTCConnectionStatus(WebRTCConnectionStatus.CONNECTED);
        break;
      case "disconnected":
        FileStore.setWebRTCConnectionStatus(
          WebRTCConnectionStatus.DISCONNECTED
        );
        break;
      case "failed":
        FileStore.setWebRTCConnectionStatus(WebRTCConnectionStatus.FAILED);
        break;
      case "closed":
        FileStore.setWebRTCConnectionStatus(WebRTCConnectionStatus.CLOSED);
        break;
      default:
        break;
    }
  };

  handleICECandidateWebRTCEvent = (event: RTCPeerConnectionIceEvent): void => {
    const { candidate } = event;

    if (candidate) {
      SocketService.emitEvent(SOCKET_EVENTS.ICE_CANDIDATE, {
        target: this.peerId,
        candidate,
      });
    }
  };

  handleDataChannelWebRTCEvent = (event: RTCDataChannelEvent): void => {
    const {
      channel,
      channel: { label },
    } = event;

    if (label === META_DATA_CHANNEL_LABEL) {
      channel.onmessage = this.handleMetaDataChannel;
    } else {
      channel.onmessage = (e) => {
        return this.handleFileReceiveWebRTCEvent(e, channel);
      };
    }

    this.dataChannelsMap[label] = channel;
  };

  // Socket events start
  handlePeerJoinedEvent = async (payload: {
    id: string;
    role: string;
  }): Promise<void> => {
    this.peerId = payload.id;
    this.peerRole = payload.role;

    this.createWebRTCConnection();

    if (this.peerRole === "peer") {
      // this means that the current user is the creator and the other is the peer
      // Data channel is required for connection creation
      // Creating meta data channel for sending file information
      this.createDataChannel({
        label: META_DATA_CHANNEL_LABEL,
        onMessageHandler: this.handleMetaDataChannel,
      });

      const offer = await this.createOffer();
      await this.webRTCConnection.setLocalDescription(offer);

      SocketService.emitEvent(SOCKET_EVENTS.OFFER, {
        target: this.peerId,
        offer,
      });
    }

    FileStore.setPeerConnectionStatus(true);
  };

  handlePeerLeftEvent = (): void => {
    this.peerId = "";
    this.peerRole = "";
    FileStore.setPeerConnectionStatus(false);
  };

  handleOfferEvent = async (
    offer: RTCSessionDescriptionInit
  ): Promise<void> => {
    await this.webRTCConnection.setRemoteDescription(offer);

    const answer = await this.createAnswer();
    await this.webRTCConnection.setLocalDescription(answer);

    SocketService.emitEvent(SOCKET_EVENTS.ANSWER, {
      target: this.peerId,
      answer,
    });
  };

  handleAnswerEvent = async (
    answer: RTCSessionDescriptionInit
  ): Promise<void> => {
    await this.webRTCConnection.setRemoteDescription(answer);
  };

  handleIceCandidateEvent = (candidate: RTCIceCandidateInit): void => {
    const iceCandidate = new RTCIceCandidate(candidate);
    this.webRTCConnection.addIceCandidate(iceCandidate);
  };
  // Socket events end
}

export default new WebRTCController();
