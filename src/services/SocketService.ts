import { io, Socket } from "socket.io-client";
import { socketURL } from "../routes";

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(socketURL);
  }

  /**
   * Function to emit events to the server.
   *
   * @returns void
   */

  emitEvent = (event: string, payload: any): void => {
    if (!this.socket) {
      throw new Error("Socket is not initialized");
    }

    this.socket.emit(event, payload);
  };

  /**
   * Function to register events to the server.
   *
   * @returns void
   */

  registerEvent = (event: string, callback: any): void => {
    this.socket.on(event, callback);
  };
}

export default new SocketService();
