import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({

})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

request.interceptors.request.use(function (config: any) {
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

let isRefreshing = false
let requests:any[] = []
request.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  if (error.response) {
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      if (!isRefreshing) {
        isRefreshing = true
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新Token失败')
          }
          store.commit('setUser', res.data.content)
          requests.forEach(cb => cb())
          requests = []
          return request(error.config)
        }).catch(err => {
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(err)
        }).finally(() => {
          isRefreshing = false
        })
      }

      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (error.request) {
      console.log('哼', error.request)
      Message.error('请求超时，请刷新重试')
    } else {
      Message.error(`请求失败:${error.message}`)
    }
  }
  return Promise.reject(error)
})

export default request
