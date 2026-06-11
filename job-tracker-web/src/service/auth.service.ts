import { axiosPublicInstance } from '.'

const loginUser = () => {
  return axiosPublicInstance.post('/api/auth/login', {
    email: 'test@user.com',
    password: '1234567890'
  })
}


export const authService = {
  loginUser,
}