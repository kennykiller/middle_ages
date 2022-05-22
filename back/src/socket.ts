import { Server } from "socket.io";

let io;

export const ioInstance = {
  init: (httpServer) => {
    io = new Server(httpServer, { cors: { origin: "http://localhost:8080" } });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io не инициализирован");
    }
    return io;
  },
};
