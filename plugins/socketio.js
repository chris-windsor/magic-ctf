import Vue from "vue";
import io from "socket.io-client";

/*
 * Configure socket.io client parameters
 *
 * Ensures client always points to host server
 * */
const socket = Vue.mixin({
  beforeMount() {
    this.socket = io("", {
      autoConnect: false
    });
  }
});
