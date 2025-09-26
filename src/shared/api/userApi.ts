import { apiClient } from './client'
import { UserProfileResponse, UserCreateRequest } from './types'

export const userApi = {
  getCurrentUser: (): Promise<UserProfileResponse> => {
    return apiClient.get<UserProfileResponse>('/api/user/me')
  },

  createUser: (data: UserCreateRequest): Promise<UserProfileResponse> => {
    return apiClient.post<UserProfileResponse>('/api/user', data)
  },
}