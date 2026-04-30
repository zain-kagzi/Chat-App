import { io } from "socket.io-client";

export const socket = io("https://chat-app-6uvx.onrender.com", {
  auth: {
    token: localStorage.getItem("token"),
  },
});
