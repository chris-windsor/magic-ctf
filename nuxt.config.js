const pkg = require("./package");

module.exports = {
  mode: "universal",
  srcDir: "client/",
  head: {
    title: "MAGIC CTF",
    meta: [
      {charset: "utf-8"},
      {name: "viewport", content: "width=device-width, initial-scale=1"},
      {hid: "description", name: "description", content: pkg.description}
    ],
    link: [{rel: "icon", href: "/favicon.png", sizes: "192x192"}]
  },
  loading: {
    color: "#582C77"
  },
  css: [
    {
      src: "@fortawesome/fontawesome-free/css/all.min.css",
      lang: "css"
    }
  ],
  plugins: [
    "~/plugins/socketio",
    "~/plugins/countdown",
    { src: '~/plugins/localStorage.js', ssr: false }
  ],
  modules: [
    "@nuxtjs/axios",
    ["nuxt-buefy", {
      defaultIconPack: "fas",
      defaultFieldLabelPosition: "on-border"
    }],
    "~~/server/io",
    "@nuxtjs/moment"
  ],
  axios: {
    baseURL: ""
  },
  build: {
    extend(config, ctx) {}
  }
};
