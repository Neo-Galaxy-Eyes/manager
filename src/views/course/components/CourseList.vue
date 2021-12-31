<template>
  <div class="course-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form
        ref="form"
        label-width="70px"
        label-position="left"
        :model="filterParams"
        >
          <el-form-item prop="courseName" label="资源名称">
            <el-input v-model="filterParams.courseName"></el-input>
          </el-form-item>
          <el-form-item prop="status" label="状态">
            <el-select v-model="filterParams.status">
              <el-option label="全部" value=""></el-option>
              <el-option label="上架" value="1"></el-option>
              <el-option label="下架" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询搜索</el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="header">
        <span>查询结果：</span>
        <el-button @click="$router.push({ name: 'course-create' })" style="float: right; margin-top: -5px" type="primary">
          添加课程
        </el-button>
      </div>
      <el-table
        :data="courses"
        style="width: 100%; margin-bottom: 20px"
        >
        <el-table-column
          prop="id"
          label="ID"
          width="50">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="180">
        </el-table-column>
        <el-table-column
          width="180"
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          width="180"
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="上架状态"
          width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="onStateChange(scope.row)"
              >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="操作"
          width="180"
          align="center"
          >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="$router.push({
                name: 'course-edit',
                params: {
                  courseId: scope.row.id
                }
              })"
              >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="$router.push({
                name: 'course-section',
                params: {
                  courseId: scope.row.id
                }
              })">内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="isLoading"
        :current-page.sync="filterParams.currentPage"
        :page-sizes="[5,10,20]"
        :page-size="filterParams.pageSize"
        layout="prev, pager, next"
        :total="totalCount"
        >
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getQueryCourses, changeState } from '@/services/course'
import { Form } from 'element-ui'
export default Vue.extend({
  name: 'CourseList',
  data () {
    return {
      courses: [],
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      totalCount: 0,
      resourceCategories: [],
      isLoading: true
    }
  },

  created () {
    this.loadCourses()
  },

  methods: {
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.filterParams)
      data.data.records.forEach((item: any) => {
        item.isStatusLoading = false
      })
      this.courses = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },

    handleSizeChange (page: number) {
      this.filterParams.pageSize = page
      this.filterParams.currentPage = 1
      this.loadCourses()
    },

    handleCurrentChange (page: number) {
      this.filterParams.currentPage = page
      this.loadCourses()
    },

    handleFilter (page: number) {
      this.filterParams.currentPage = 1
      this.loadCourses()
    },

    onSubmit () {
      this.filterParams.currentPage = 1
      this.loadCourses()
    },

    onReset () {
      (this.$refs.form as Form).resetFields()
      this.filterParams.currentPage = 1
      this.loadCourses()
    },

    async onStateChange (course: any) {
      course.isStatusLoading = true
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      if (course.status !== 0) {
        this.$message.success('上架成功')
      }
      course.isStatusLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
