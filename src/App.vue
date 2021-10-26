<template>
  <div id="app">
    <keep-alive include="Register|Login">
    <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
