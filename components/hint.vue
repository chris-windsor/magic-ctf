<template>
  <button class="button is-rounded is-danger" @click="$emit('request', cost)">-{{cost}} points</button>
</template>

<script>
  export default {
    props: ["cost"]
  }

</script>
