/* eslint-disable class-methods-use-this */
import { SOCKET_EVENTS } from "../constants/SocketEvents";
import { getSlugRoute } from "../routes";
import SocketService from "./SocketService";

class RoomService {
  /**
   * Function to create a new room at the server
   * The room is used to transfer signalling information for
   * webRTC connection between peers

   * @returns Promise to return room slug
   */

  createRoom = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      fetch(getSlugRoute).then((res) => {
        if (!res.ok) {
          throw res;
        }

        // Parse the response
        res
          .json()
          .then((json) => {
            resolve(json && json.data && json.data.slug);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  };

  /**
   * Function to create socket connection.
   * Responsible for relaying signalling information and join room
   
   * @param roomSlug - slug of room to connect
   */

  joinRoom = (roomSlug: string): void => {
    SocketService.emitEvent(SOCKET_EVENTS.JOIN_ROOM, roomSlug);
  };

  /**
   * Function to return the slug currently present in address bar
   *
   * @returns roomSlug - A kind of human readable room id (contains a noun and an adjective)
   */

  getCurrentRoomSlug = (): string => {
    return window.location.href.split("room/")?.[1];
  };
}

export default new RoomService();
