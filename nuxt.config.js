const pkg = require("./package");

module.exports = {
  mode: "universal",

  /*
   * Change default source directory for different folder structuring
   * */
  srcDir: "client/",

  /*
   ** Headers of the page
   */
  head: {
    title: "MAGIC CTF",
    meta: [
      {charset: "utf-8"},
      {name: "viewport", content: "width=device-width, initial-scale=1"},
      {hid: "description", name: "description", content: pkg.description}
    ],
    link: [{rel: "icon", href: "/favicon.png", sizes: "192x192"}]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#5a79e8"
  },

  /*
   ** Global CSS
   */
  css: [
    {
      src: "@fortawesome/fontawesome-free/css/all.min.css",
      lang: "css"
    }
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/socketio",
    "~/plugins/countdown"
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    /*
     * Axios module
     *
     * Adds easy request building and sending
     * */
    "@nuxtjs/axios",
    /*
     * Buefy module
     *
     * Adds pre-built bulma components with Vue functionality
     * */
    ["nuxt-buefy", {
      defaultIconPack: "fas"
    }],
    /*
     * Socket.io
     *
     * Adds easy socket handling
     * */
    "~~/server/io",
    /*
     * Moment
     *
     * Adds date utilities for just about everything
     * */
    "@nuxtjs/moment"
  ],
  /*
   * Axios module configuration
   */
  axios: {
    baseURL: ""
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
