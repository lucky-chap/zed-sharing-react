// STUN Servers to generate ICE Candidates for the WebRTC connection.

const webRTCIceServers = {
  iceServers: [
    {
      urls: [
        "stun:stun.stunprotocol.org",
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
      ],
    },
  ],
};

export { webRTCIceServers };
