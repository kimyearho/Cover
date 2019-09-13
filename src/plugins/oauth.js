import axios from "axios"

const authService = axios.create({
    baseURL: 'https://www.googleapis.com/oauth2/v1',
    timeout: 5000,
})

/* Request interceptors */
authService.interceptors.request.use(
    function (config) {
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

/* Response interceptors */
authService.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        return Promise.reject(error)
    }
)

export default authService
