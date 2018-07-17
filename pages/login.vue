<template>
  <div>
    <input type="text" v-model="username" placeholder="username">
    <input type="password" v-model="password" placeholder="password">
    <button @click="login()">submit</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        username: "cwindsor",
        password: "123"
      }
    },
    methods: {
      login() {
        this.$store.dispatch("login", {
          username: this.username,
          password: this.password
        })
      }
    }
  }

</script>
