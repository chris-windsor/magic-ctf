import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// Polyfill for `window.fetch()`
require("whatwg-fetch");

const store = () =>
  new Vuex.Store({
    state: {
      authUser: null
    },

    mutations: {
      SET_USER: function(state, user) {
        state.authUser = user;
      }
    },

    actions: {
      nuxtServerInit({ commit }, { req }) {
        if (req.session && req.session.authUser) {
          commit("SET_USER", req.session.authUser);
        }
      },
      register({ commit }, { username, teamName, locationId, password, passwordConf }) {
        return fetch("/api/register", {
          // Send the client cookies to the server
          credentials: "same-origin",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            teamName,
            locationId,
            password,
            passwordConf
          })
        })
          .then((res) => {
            if (res.status === 401) {
              throw new Error("Bad credentials");
            } else {
              return res.json();
            }
          })
          .then((authUser) => {
            commit("SET_USER", authUser);
            if (authUser.accountType === "player") {
              this.$router.replace("/dashboard");
            } else {
              this.$router.replace("/admin");
            }
          })
          .catch((err) => {
            console.error(err);
          });
      },
      login({ commit }, { username, password }) {
        return fetch("/api/login", {
          // Send the client cookies to the server
          credentials: "same-origin",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password
          })
        })
          .then((res) => {
            if (res.status === 401) {
              throw new Error("Bad credentials");
            } else {
              return res.json();
            }
          })
          .then((authUser) => {
            commit("SET_USER", authUser);
            if (authUser.accountType === "player") {
              this.$router.replace("/dashboard");
            } else {
              this.$router.replace("/admin");
            }
          })
          .catch((err) => {
            console.error(err);
          });
      },
      logout({ commit }) {
        return fetch("/api/logout", {
          // Send the client cookies to the server
          credentials: "same-origin",
          method: "POST"
        }).then(() => {
          commit("SET_USER", null);
          this.$router.replace("/");
        });
      }
    }
  });

export default store;
