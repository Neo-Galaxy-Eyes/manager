<template>
  <div class="role-list">
    123
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <create-or-edit
       @success="onSuccess"
       @cancel="dialogVisible = false"
       />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getRoles, deleteRole } from '@/services/role'
import { Form } from 'element-ui'
import CreateOrEdit from './CreateOrEdit.vue'
export default Vue.extend({
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      roles: [],
      form: {
        current: 1,
        size: 50,
        name: ''
      },
      loading: false,
      dialogVisible: false
    }
  },

  created () {
    this.loadRoles()
  },

  methods: {
    async loadRoles () {
      this.loading = true
      const { data } = await getRoles(this.form)
      this.roles = data.data.records
      this.loading = false
    },

    onSubmit () {
      this.loadRoles()
    },

    handleEdit (role: any) {
      console.log(role)
    },

    async handleDelete (role: any) {
      try {
        await this.$confirm(`需要删除:${role.name}？`, '删除提示')
        await deleteRole(role.id)
        this.$message.success('删除成功')
        this.loadRoles()
      } catch (err) {
        if (err && err.response) {
          this.$message.error('删除失败，请重试')
        } else {
          this.$message.info('取消删除')
        }
      }
    },

    onReset () {
      (this.$refs.from as Form).resetFields()
      this.loadRoles()
    },

    onSuccess () {
      this.dialogVisible = false
      this.loadRoles()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
