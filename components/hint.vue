<template>
  <div>
    <div class="box" v-if="hintData.content !== ''">
      {{hintData.content}}
    </div>
    <button class="button is-rounded is-danger" @click="$emit('request', id, hintData.cost)" v-else>-{{hintData.cost}} points</button>
  </div>
</template>

<script>
  export default {
    props: ["hintData", "id"]
  }

</script>
