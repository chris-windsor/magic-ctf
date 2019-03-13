import io from "socket.io-client";

/*
 * Configure socket.io client parameters
 *
 * Ensures client always points to host server
 * */
const socket = io("", {
  autoConnect: false
});

export default socket;
