import axios from "axios-jsonp-pro"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
NProgress.configure({ showSpinner: false })

const service = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  timeout: 5000,
  headers: {
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Encoding': 'gzip'
  }
})

/* Request interceptors */
service.interceptors.request.use(
  function (config) {
    NProgress.start()
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

/* Response interceptors */
service.interceptors.response.use(
  function (response) {
    NProgress.done()
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default service
