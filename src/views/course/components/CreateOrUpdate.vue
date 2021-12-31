<template>
  <el-card>
     <div slot="header">
        <el-steps :active="activeStep" simple>
          <el-step
          :title="item.title"
          :icon="item.icon"
          v-for="(item, index) in steps"
          :key="index"
          @click.native="activeStep = index"
          ></el-step>
        </el-steps>
     </div>
     <el-form label-width="80px">
       <div v-show="activeStep == 0">
        <el-form-item label="课程名称">
          <el-input v-model="course.courseName"></el-input>
        </el-form-item>
        <el-form-item label="课程简介">
          <el-input  v-model="course.brief"></el-input>
        </el-form-item>
        <el-form-item label="课程概述">
          <el-input
            style="margin-bottom: 10px"
            v-model="course.previewFirstField"
            placeholder="概述1"
          ></el-input>
          <el-input
            v-model="course.previewSecondField"
            placeholder="概述2"
          ></el-input>
        </el-form-item>
        <el-form-item label="讲师姓名">
          <el-input v-model="course.teacherDTO.teacherName"></el-input>
        </el-form-item>
        <el-form-item label="讲师简介">
          <el-input v-model="course.teacherDTO.description">></el-input>
        </el-form-item>
        <el-form-item label="课程排序">
          <el-input-number v-model="course.sortNum" label="描述文字"></el-input-number>
        </el-form-item>
       </div>
       <div v-show="activeStep == 1">
         <el-form-item label="课程封面">
              <course-image v-model="course.courseListImg" />
          </el-form-item>
          <el-form-item label="介绍封面">
              <course-image v-model="course.courseImgUrl" />
          </el-form-item>
       </div>
       <div v-show="activeStep == 2">
         <el-form-item label="售卖价格">
           <el-input v-model.number="course.activityCourseDTO.amount" type="number">
             <template slot="append">元</template>
           </el-input>
         </el-form-item>
         <el-form-item label="库存">
           <el-input v-model.number="course.activityCourseDTO.stock" type="number">
             <template slot="append">个</template>
           </el-input>
          </el-form-item>
       </div>
       <div v-show="activeStep == 3">
         <el-form-item label="限时秒杀">
           <el-switch
            v-model="isSeckill"
            active-color="#13ce66"
            inactive-color="#ff4949"
            >
            </el-switch>
         </el-form-item>
         <template v-if="isSeckill">
           <el-form-item label="开始时间">
              <el-date-picker
              v-model="course.activityCourseDTO.beginTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
              v-model="course.activityCourseDTO.endTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
         </template>
       </div>
       <div v-show="activeStep == 4">
         <el-form-item label="课程详情">
           <text-editor v-model="course.courseDescriptionMarkDown" />
           <el-form-item label="是否发布">
            <el-switch
              v-model="course.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              />
           </el-form-item>
         </el-form-item>
         <el-form-item>
           <el-button @click="handleSave" type="primary">保存</el-button>
         </el-form-item>
       </div>
       <el-form-item v-if="activeStep >= 0 && activeStep < 4">
         <el-button @click="activeStep++">下一步</el-button>
       </el-form-item>
     </el-form>
   </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdateCourse, getCourseById } from '@/services/course'
import CourseImage from './CourseImage.vue'
import TextEditor from '@/components/TextEditor/index.vue'
import moment from 'moment'
export default Vue.extend({
  name: 'CreateOrUpdateCourse',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  components: {
    CourseImage,
    TextEditor
  },
  data () {
    return {
      activeStep: 0,
      steps: [
        { title: '基本信息', icon: 'el-icon-edit' },
        { title: '课程封面', icon: 'el-icon-edit' },
        { title: '销售信息', icon: 'el-icon-edit' },
        { title: '秒杀活动', icon: 'el-icon-edit' },
        { title: '课程详情', icon: 'el-icon-edit' }
      ],
      imageUrl: '',
      isSeckill: false,
      course: {
        // id: 0,
        courseName: '',
        brief: '',
        previewFirstField: '',
        previewSecondField: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        courseDescriptionMarkDown: '',
        status: 0,
        sales: 0,
        activityCourse: false,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },

  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },

  methods: {
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      const { activityCourseDTO } = data.data
      activityCourseDTO.beginTime = moment(activityCourseDTO.beginTime).format('YYY-MM-DD')
      activityCourseDTO.endTime = moment(activityCourseDTO.endTime).format('YYY-MM-DD')
      this.course = data.data
    },
    handleAvatarSuccess (res: any, file: any) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.course)
      console.log(data)
      this.$router.back()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
