import { io } from "socket.io-client";

class SocketioService {
  socket: any;
  constructor() {}

  setupSocketConnection() {
    // eslint-disable-next-line
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT as string);
    this.socket.emit("my message", "Hello there from Vue.");

    this.socket.on("my broadcast", (data: any) => {
      console.log(data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
export default new SocketioService();
