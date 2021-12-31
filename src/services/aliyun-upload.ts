import request from '@/utils/request'

export const getAliyunImageUploadAddressAdnAuth = () => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/aliyunImagUploadAddressAdnAuth.json'
  })
}

export const getAliyunVideoUploadAddressAdnAuth = (params: any) => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/aliyunVideoUploadAddressAdnAuth.json',
    params
  })
}

export const aliyunTransCode = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/upload/aliyunTransCode.json',
    data
  })
}

export const getAliyunTransCodePerent = (lessonId: any) => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/aliyunTransCodePerent.json',
    params: {
      lessonId
    }
  })
}
