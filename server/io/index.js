module.exports = function () {
  const server = require("http").createServer(this.nuxt.renderer.app);

  this.nuxt.listen = (port, host) =>
    new Promise(resolve =>
      server.listen(port || 3000, host || "localhost", resolve)
    );

  this.addVendor("socket.io-client");
};
