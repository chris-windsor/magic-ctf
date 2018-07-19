<template>
  <div class="box">
    <div class="field is-grouped">
      <div class="control has-icons-left has-icons-right is-expanded">
        <input type="text" class="input is-info" placeholder="Location name" :value="location" @input="$emit('updateLocation', id, $event.target.value)">
        <span class="icon is-left">
          <i class="fa fa-broadcast-tower"></i>
        </span>
      </div>
      <p class="control">
        <a class="button is-danger" @click="$emit('delete', id)">Delete</a>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["location", "id"]
  }

</script>
