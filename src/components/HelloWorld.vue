<template>
  <div class="root">
      <img src="@/assets/images/2.jpg">
      hello {{this.name}}
  </div>
</template>

<script>
export default {
    name:'hello-world',
    data(){
        return {
            name:'vue'
        }
    }
}
</script>

<style>
.root{
    color: aquamarine;
    background-color: seagreen;
}
</style>
