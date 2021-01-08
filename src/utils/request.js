import axios from 'axios'
import Vue from 'vue'


const service = axios.create({
    baseURL: process.env.GRIDSOME_API_URL,
    timeout: 15000
})

service.interceptors.request.use(
    config => {
        return config
    },
    error => {

    }
)


service.interceptors.response.use(
    response => {
        return response
    },
    error => {
        let message
        switch (error.response.status) {
            case 401:
                message = "Token错误"
                break
            default:
                message = error.response.data
                console.log(message)
                break
        }
        Vue.prototype.$message({
            message: message,
            type: 'error'
        })
        return Promise.reject('error')
    }
)

export default service
