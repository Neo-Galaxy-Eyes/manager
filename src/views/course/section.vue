<template>
  <div class="course-section">
    <el-card>
      <el-tree
      :data="sections"
      :props="defaultProps"
      draggable
      :allow-drop="handleAllowDrop"
      @node-drop="handleSort"
      >
        <div class="inner" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="data.sectionName" class="actions">
            <el-button>编辑</el-button>
            <el-button>添加课时</el-button>
            <el-button>状态</el-button>
          </span>
          <span v-else class="actions">
            <el-button>编辑</el-button>
            <el-button
              @click="$router.push({
                name: 'course-video',
                params: {
                  courseId: courseId
                },
                query: {
                  sectionId: node.parent.id,
                  lessonId: data.id
                }
              })"
            >上传视频</el-button>
            <el-button>状态</el-button>
          </span>
        </div>
      </el-tree>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getSectionAndLesson,
  saveOrUpdateSection,
  saveOrUpdateLesson,
  getSectionById
} from '@/services/course-section'
import { saveOrUpdateCourse } from '@/services/course'
export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data: any) {
          return data.sectionName || data.theme
        }
      }
    }
  },

  created () {
    this.loadSections()
  },

  methods: {
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)
      this.sections = data.data
    },

    handleAllowDrop (draggingNode: any, dropNode: any, type: any) {
      return draggingNode.data.sectionId === dropNode.data.sectionId && type !== 'inner'
    },

    async handleSort (dragNode: any, dropNode: any, type: any, event: any) {
      try {
        await Promise.all(dropNode.parent.childNodes.map((item: any, index: number) => {
          if (dragNode.data.lessonDTOS) {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1
            })
          } else {
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index + 1
            })
          }
        }))
        this.$message.success('排序成功')
      } catch (err) {
        this.$message.error('排序失败')
      }
    }
  }

})
</script>

<style lang="scss" scoped>
.inner {
  flex: 1;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}

::v-deep .el-tree-node__content {
  height: auto;
}
</style>
