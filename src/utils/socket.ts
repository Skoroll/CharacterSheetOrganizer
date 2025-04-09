// src/socket.ts
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: true,
  transports: ["websocket"], // facultatif mais plus stable
});

export default socket;
