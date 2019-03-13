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
      register(
        { commit },
        { username, isCoach, teamName, locationId, password, passwordConf }
      ) {
        return fetch("/api/register", {
          // Send the client cookies to the server
          credentials: "same-origin",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            isCoach,
            teamName,
            locationId,
            password,
            passwordConf
          })
        })
          .then(res => {
            if (res.status === 401) {
              throw new Error("Passwords do not match");
            } else if (res.status === 400) {
              throw new Error("All fields required");
            } else if (res.status === 409) {
              throw new Error("Username taken");
            } else {
              return res.json();
            }
          })
          .then(authUser => {
            commit("SET_REGISTER_ERROR", "");
            commit("SET_USER", authUser);
            if (authUser.accountType === "player") {
              this.$router.replace("/dashboard");
            } else if (authUser.accountType === "coach") {
              this.$router.replace("/coach");
            } else if (authUser.accountType === "admin") {
              this.$router.replace("/admin");
            } else {
              this.$router.replace("/");
            }
          })
          .catch(err => {
            commit("SET_REGISTER_ERROR", err.toString());
          });
      },
      login({ commit }, { accountName, password }) {
        return fetch("/api/login", {
          // Send the client cookies to the server
          credentials: "same-origin",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            accountName,
            password
          })
        })
          .then(res => {
            if (res.status === 401) {
              throw new Error("Username or password is incorrect");
            } else if (res.status === 400) {
              throw new Error("All fields required");
            } else {
              return res.json();
            }
          })
          .then(authUser => {
            commit("SET_LOGIN_ERROR", "");
            commit("SET_USER", authUser);
            if (authUser.accountType === "player") {
              this.$router.replace("/dashboard");
            } else if (authUser.accountType === "coach") {
              this.$router.replace("/coach");
            } else if (authUser.accountType === "admin") {
              this.$router.replace("/admin");
            } else {
              this.$router.replace("/");
            }
          })
          .catch(err => {
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
