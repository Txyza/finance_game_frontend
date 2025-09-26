import { apiClient } from './client'
import { StoreListResponse, StoreBuyRequest } from './types'

export const storeApi = {
  getStoreItems: (): Promise<StoreListResponse> => {
    return apiClient.get<StoreListResponse>('/api/store/list')
  },

  buyItem: (data: StoreBuyRequest): Promise<void> => {
    return apiClient.post<void>('/api/store/buy', data)
  },
}