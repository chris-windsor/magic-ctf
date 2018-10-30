<template>
  <div>
    <div class="box" v-if="hintData.content !== ''">
      {{hintData.content}}
    </div>
    <button class="button is-rounded is-danger" @click="request()" :disabled="!hintData.unlocked" :title="hintData.unlocked ? '' : 'Unlock previous hints first...'" v-else>-{{hintData.cost}} points</button>
  </div>
</template>

<script>
  export default {
    props: ["hintData", "id"],
    methods: {
      request() {
        if (this.hintData.unlocked) {
          this.$emit("request", this.id, this.hintData.cost);
        }
      }
    }
  };
</script>
