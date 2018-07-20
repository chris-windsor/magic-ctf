const pkg = require("./package");

module.exports = {
  mode: "universal",

  /*
  ** Headers of the page
  */
  head: {
    title: "MAGIC CTF",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ],
    link: [ { rel: "icon", type: "image/x-icon", href: "/favicon.ico" } ]
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
  plugins: [],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    "@nuxtjs/axios",
    // Doc: https://buefy.github.io/#/documentation
    "nuxt-buefy",
    // Socket.io
    "~/io"
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: ""
    // See https://github.com/nuxt-community/axios-module#options
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
