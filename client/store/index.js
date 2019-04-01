import Vue from "vue";
import Vuex from "vuex";
import "whatwg-fetch";

Vue.use(Vuex);

const store = () =>
  new Vuex.Store({
    state: {
      authUser: null,
      loginError: "",
      registerError: "",
      timezone: null
    },

    mutations: {
      SET_USER: function (state, user) {
        state.authUser = user;
      },
      SET_LOGIN_ERROR: function (state, err) {
        state.loginError = err;
      },
      SET_REGISTER_ERROR: function (state, err) {
        state.registerError = err;
      },
      SET_USER_TIMEZONE: function (state, timezone) {
        state.timezone = timezone;
      }
    },

    actions: {
      nuxtServerInit({commit}, {req}) {
        if (req.session && req.session.authUser) {
          commit("SET_USER", req.session.authUser);
        }
      },
      register(
        {commit},
        {name, locationId, password, passwordConf}
      ) {
        return fetch("/api/register", {
          credentials: "same-origin",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
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
              throw new Error("Team name taken");
            } else {
              return res.json();
            }
          })
          .then(authUser => {
            commit("SET_REGISTER_ERROR", "");
            commit("SET_USER", authUser);
            if (authUser.accountType === "player") {
              this.$router.replace("/dashboard");
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
      login({commit}, {accountName, password}) {
        return fetch("/api/login", {
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
              throw new Error("Team name or password is incorrect");
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
      logout({commit}) {
        return fetch("/api/logout", {
          credentials: "same-origin",
          method: "POST"
        })
          .then(() => {
            commit("SET_USER", null);
            this.$router.replace("/");
          });
      }
    }
  });

export default store;