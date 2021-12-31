declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

//告诉ts，window上存在AliyunUpload
interface Window {
  AliyunUpload: any
}
