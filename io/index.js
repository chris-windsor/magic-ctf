module.exports = function() {
  const server = require("http").createServer(this.nuxt.renderer.app);
  const io = require("socket.io")(server);

  // overwrite nuxt.listen()
  this.nuxt.listen = (port, host) =>
    new Promise((resolve) => server.listen(port || 3000, host || "localhost", resolve));

  // Add `socket.io-client` in vendor
  this.addVendor("socket.io-client");
};
