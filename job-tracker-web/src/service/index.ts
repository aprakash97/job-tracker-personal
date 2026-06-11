import axios from 'axios'
import { APP_CONFIGS } from '../utilities/constants/config.constant'
import { authService } from './auth.service.ts'

axios.defaults.baseURL = APP_CONFIGS.APP_BASE
console.log('test', APP_CONFIGS.APP_BASE, import.meta.env)
export const axiosPublicInstance = axios.create()

export const axiosPrivateInstance = axios.create()

// Request interceptor to manage authorization & headers
axiosPrivateInstance.interceptors.request.use(
  async (request) => {
    console.log(authService)
    // request.headers.Authorization = `Bearer ${request?.}`

    // const _encryptedUserRole = await authService.fetchActiveUserRole()
    // if (_encryptedUserRole) {
    //   const bytes =
    //     _encryptedUserRole !== '' &&
    //     CryptoJS.AES.decrypt(_encryptedUserRole, APP_CONFIGS.DATA_ENC_SECRET)
    //   const activeUserRole: UserRoleDto = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    //   request.headers['user-role'] = activeUserRole.userRoleKey
    // }

    return request
  },
  (error) => {
    console.error('Req interceptor Error', error)
  }
)

export * from './auth.service.ts'
