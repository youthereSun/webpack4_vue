<template>
    <div>
        <div class="test"></div>
       <hello-world/>
    </div>
</template>

<script>
    import HelloWorld from "./components/HelloWorld";
    export default {
        name: "app",
        components:{
            HelloWorld
        }
    }
</script>

<style scoped>
    .test{
        background-color: white;
    }


</style>
