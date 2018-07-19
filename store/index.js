import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// Polyfill for `window.fetch()`
require("whatwg-fetch");

const store = () =>
  new Vuex.Store({
    state: {
      authUser: null,
      loginError: "",
      registerError: ""
    },

    mutations: {
      SET_USER: function(state, user) {
        state.authUser = user;
      },
      SET_LOGIN_ERROR: function(state, err) {
        state.loginError = err;
      },
      SET_REGISTER_ERROR: function(state, err) {
        state.registerError = err;
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
              throw new Error("Passwords do not match");
            } else if (res.status === 400) {
              throw new Error("All fields required");
            } else {
              return res.json();
            }
          })
          .then((authUser) => {
            commit("SET_REGISTER_ERROR", "");
            commit("SET_USER", authUser);
            if (authUser.accountType === "player") {
              this.$router.replace("/dashboard");
            } else {
              this.$router.replace("/admin");
            }
          })
          .catch((err) => {
            commit("SET_REGISTER_ERROR", err.toString());
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
              throw new Error("Username or password is incorrect");
            } else {
              return res.json();
            }
          })
          .then((authUser) => {
            commit("SET_LOGIN_ERROR", "");
            commit("SET_USER", authUser);
            if (authUser.accountType === "player") {
              this.$router.replace("/dashboard");
            } else {
              this.$router.replace("/admin");
            }
          })
          .catch((err) => {
            commit("SET_LOGIN_ERROR", err.toString());
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
