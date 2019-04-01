<template>
  <div class="box">
    <div class="field is-grouped is-horizontal">
      <div class="control has-icons-left is-expanded">
        <input class="input is-info" placeholder="Hint content" type="text" v-model="hintData.content">
        <span class="icon is-left">
          <i class="fa fa-pencil-alt"></i>
        </span>
      </div>
      <div class="control has-icons-left is-expanded">
        <input class="input is-info" placeholder="Hint cost" type="number" v-model.number="hintData.cost">
        <span class="icon is-left">
          <i class="fa fa-money-bill-alt"></i>
        </span>
      </div>
      <div class="control">
        <a @click="$emit('delete', id)" class="button is-danger">
          <span class="icon is-small">
            <i class="fas fa-times"></i>
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["hintData", "id"]
  };
</script>
