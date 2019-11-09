<template>
  <div class="box">
    <div class="field is-grouped">
      <div class="control has-icons-left has-icons-right is-expanded">
        <input :value="location" @input="$emit('updateLocation', id, $event.target.value)" class="input is-info" placeholder="Location name"
               type="text">
        <span class="icon is-left">
          <i class="fa fa-broadcast-tower"></i>
        </span>
      </div>
      <p class="control">
        <a @click="$emit('delete', id)" class="button is-danger">
          <span class="icon is-small">
            <i class="fas fa-times"></i>
          </span>
        </a>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["location", "id"]
  };
</script>
