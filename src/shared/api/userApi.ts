import { apiClient } from './client'
import { UserProfileResponse, UserCreateRequest } from './types'

export const userApi = {
  getCurrentUser: (): Promise<UserProfileResponse> => {
    return apiClient.get<UserProfileResponse>('/api/v1/user/me')
  },

  createUser: (data: UserCreateRequest): Promise<UserProfileResponse> => {
    return apiClient.post<UserProfileResponse>('/api/v1/user', data)
  },
}