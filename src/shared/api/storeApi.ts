import { apiClient } from './client'
import { StoreListResponse, StoreBuyRequest } from './types'

export const storeApi = {
  getStoreItems: (): Promise<StoreListResponse> => {
    return apiClient.get<StoreListResponse>('/api/v1/store/list/')
  },

  buyItem: (data: StoreBuyRequest): Promise<void> => {
    return apiClient.post<void>('/api/v1/store/buy/', data)
  },
}