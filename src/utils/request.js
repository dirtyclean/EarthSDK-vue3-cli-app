/*
 * @Author: dirtyclean
 * @Date: 2021-07-05 10:16:50
 * @Last Modified by: dirtyclean
 * @Last Modified time: 2021-12-10 10:46:30
 */
import axios from 'axios'
import { notification, message } from 'ant-design-vue'
import router from '../router'
import { constant } from '../config'
import { getStorage, removeStorage } from '@/utils/storage/localStorage'
let hasNotification = false

const service = axios.create({
  timeout: 60 * 1000,
  baseURL: constant.BASE_URL
})
service.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
service.interceptors.request.use(config => {
  const token = getStorage('token')
  const fileToken = getStorage('fileToken')
  const currUserSys = router.currentRoute.path.split('/')[1]
  if (fileToken) {
    config.headers.token = fileToken
    // removeStorage('fileToken')
  }
  if (token) {
    config.headers.Authorization = constant.TOKEN_PREFIX + token
  }
  config.headers.systemID = getStorage('system') && getStorage('system')[currUserSys]
  return config
})

service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (
        (!response.data && response.data !== false) ||
        (response.data.code && response.data.code !== '200' && response.data.code !== 200)
      ) {
        return Promise.reject(response)
      }
      return response.data
    } else {
      Promise.reject(response)
    }
  },
  error => {
    console.log(error)
    return Promise.reject(error.response)
  }
)

const createNotification = function(msg) {
  console.log(hasNotification, 'hasNotification')
  if (!hasNotification) {
    notification.open({
      message: '系统通知',
      description: msg || '登陆状态过期，请重新登陆',
      onClose() {
        hasNotification = false
      }
    })
    hasNotification = true
  }
}
const notification401 = msg => {
  createNotification(msg) // msg
  setTimeout(() => {
    router.push('/login')
  })
}
function whenErr(url, reject, error = '') {
  const { status, data } = error
  console.log(error, data, status)
  const isProduction = process.env.NODE_ENV === 'production'
  if (data || status) {
    const code = data.code ? data.code : status
    switch (code) {
      case '401':
      case 401:
        notification401(data.message)
        return reject(error)
      case 404:
        message.error(`${url} --> 404未找到`)
        return reject(error)
    }
  }
  if (!data) {
    // 无任何内容返回
    message.error(`${url} --> 无任何内容返回`)
  } else if (data.message) {
    message.error(h => {
      return <span domPropsInnerHTML={data.message || '服务器响应出错'}></span>
    })
  } else if (error.data instanceof ArrayBuffer) {
    message.error('服务器响应出错')
  } else {
    // 其他
    isProduction && message.error('服务器响应出错')
    !isProduction && message.error(JSON.stringify(data))
  }
  return reject(error)
}
const request = config => {
  return new Promise((resolve, reject) => {
    service(config)
      .then(res => {
        resolve(res)
      })
      .catch(e => {
        whenErr(config.url, reject, e)
      })
  })
}
function get(url, params, options = {}) {
  return request(Object.assign(options, { url, params }))
}
function post(url, data, options = {}) {
  return request(Object.assign(options, { url, data, method: 'post' }))
}
function put(url, data, options = {}) {
  return request(Object.assign(options, { url, data, method: 'put' }))
}
function del(url, params, options = {}) {
  return request(Object.assign(options, { url, params, method: 'delete' }))
}
export default {
  post,
  get,
  put,
  del,
  request,
  notification401
}
