<template>
  <div class="course-video">
    <el-card>
      <div slot="header">
        <span>课程</span>
        <br />
        <span>阶段</span>
        <br />
        <span>课时</span>
      </div>
      <el-form label-width="70px">
        <el-form-item label="视频上传">
          <input ref="video-file" type="file" />
        </el-form-item>
        <el-form-item label="封面上传">
          <input ref="image-file" type="file" />
        </el-form-item>
        <el-form-item>
          <el-button
           type="primary"
           @click="handleUpload"
           >开始上传</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
        <el-form-item>
          <p>视频上传中：{{uploadPercent}}%</p>
          <p v-if="isUploadSuccess">视频转码中：{{isTransCodeSuccess ? '完成' : '正在处理，稍后'}}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getAliyunImageUploadAddressAdnAuth,
  getAliyunVideoUploadAddressAdnAuth,
  aliyunTransCode,
  getAliyunTransCodePerent
} from '@/services/aliyun-upload'
export default Vue.extend({
  name: 'CourseVideo',
  data () {
    return {
      uploader: null,
      imageURL: '',
      videoId: null,
      uploadPercent: 0,
      isUploadSuccess: false,
      isTransCodeSuccess: false
    }
  },
  computed: {
    video () {
      return this.$refs['video-file']
    },
    image () {
      return this.$refs['image-file']
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        userId: '1618139964448548',
        region: '',
        partSize: 1048576,
        parallel: 5,
        retryCount: 3,
        retryDuration: 2,
        onUploadstarted: async (uploadInfo: any) => {
          let uploadAddressAndAuth
          if (uploadInfo.isImage) {
            const { data } = await getAliyunImageUploadAddressAdnAuth()
            uploadAddressAndAuth = data.data
            this.imageURL = data.data.imageURL
          } else {
            const { data } = await getAliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })
            uploadAddressAndAuth = data.data
            this.videoId = uploadAddressAndAuth.videoId
          }

          (this.uploader as any).setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
        },
        onUploadSucceed: function (uploadInfo: any) {
          console.log('onUploadSucceed111', uploadInfo)
        },
        onUploadFailed: function (uploadInfo: any, code: any, message: any) {
          console.log('onUploadFailed', uploadInfo)
        },
        onUploadProgress: (uploadInfo: any, totalSize: any, loadedPercent: any) => {
          console.log('onUploadProgress', uploadInfo)
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        onUploadTokenExpired: function (uploadInfo: any) {
          console.log('onUploadTokenExpired', uploadInfo)
        },
        onUploadEnd: async (uploadInfo: any) => {
          this.isUploadSuccess = true
          if (this.videoId) {
            const { data } = await aliyunTransCode({
              lessonId: this.$route.query.lessonId,
              coverImageUrl: this.imageURL,
              fileName: (this.video as any).files[0].name,
              fileId: this.videoId
            })
            console.log('是不是小狐狸', data)
            const timer = setInterval(async () => {
              const { data } = await getAliyunTransCodePerent(this.$route.query.lessonId)
              console.log(data.data)
              if (data.data === 100) {
                this.isTransCodeSuccess = true
                window.clearInterval(timer)
              }
            }, 3000)
          }
        }
      })
    },

    handleUpload () {
      this.isUploadSuccess = false
      this.isTransCodeSuccess = false
      this.uploadPercent = 0

      const videoFile = (this.video as any).files[0]
      const imageFile = (this.image as any).files[0]
      const uploader = this.uploader as any

      uploader.addFile(imageFile, null, null, null, '{"Vod":{}}')
      uploader.addFile(videoFile, null, null, null, '{"Vod":{}}')

      uploader.startUpload()
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
