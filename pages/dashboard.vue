<template>
  <div>
    <h1>Super secret page</h1>
    <p>Welcome {{username}}.</p>
    <nuxt-link to="/">Back to the home page</nuxt-link>
  </div>
</template>

<script>
  export default {
    layout: "profile",
    computed: {
      username() {
        if (this.$store.state.authUser !== null) {
          return this.$store.state.authUser.username
        }
      }
    },
    fetch({
      store,
      redirect
    }) {
      if (!store.state.authUser) {
        return redirect('/')
      } else {
        if (store.state.authUser.accountType === "admin") {
          return redirect('/admin');
        }
        // passed all checks for player...
        document.title = `MAGIC CTF | ${store.state.authUser.teamName}`;
      }
    }
  }

</script>
