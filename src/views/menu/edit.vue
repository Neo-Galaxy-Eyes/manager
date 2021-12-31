<template>
  <div id="menu-edit">
    <create-or-edit :is-edit="true" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import createOrEdit from './components/createOrEdit.vue'
export default Vue.extend({
  components: { createOrEdit },
  name: 'MenuEdit',
  data () {
    return {}
  }
})
</script>

<style lang="scss" scoped>

</style>
