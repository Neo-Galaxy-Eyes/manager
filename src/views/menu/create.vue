<template>
  <div id="menu-create">
    <create-or-edit />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import createOrEdit from './components/createOrEdit.vue'
export default Vue.extend({
  components: { createOrEdit },
  name: 'MenuCreate',
  data () {
    return {}
  }
})
</script>

<style lang="scss" scoped>

</style>
