<template>
  <div>
    123
    <button @click="goBack">back</button>
  </div>
</template>

<script>
export default {
    name: 'Overview',
    methods: {
        goBack() {
            this.$router.replace('/login').catch((e) => {})
        }
    }
}
</script>

<style>

</style>