<template>
  <div class="box">
    <div class="field is-grouped">
      <div class="control has-icons-left is-expanded">
        <input type="text" class="input is-info" placeholder="Hint content" v-model="hintData.content">
        <span class="icon is-left">
          <i class="fa fa-pencil-alt"></i>
        </span>
      </div>
      <div class="control has-icons-left is-expanded">
        <input type="number" class="input is-info" placeholder="Hint cost" v-model.number="hintData.cost">
        <span class="icon is-left">
          <i class="fa fa-money-bill-alt"></i>
        </span>
      </div>
    </div>
    <button class="button is-danger is-rounded is-small" @click="$emit('delete', id)">Delete hint</button>
  </div>
</template>

<script>
  export default {
    props: ["hintData", "id"]
  };
</script>
