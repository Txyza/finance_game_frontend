import { apiClient } from './client'
import {
  WorkListResponse,
  WorkStartResponse,
  WorkStopRequest,
  WorkStopResponse,
} from './types'

export const workApi = {
  getWorkList: (): Promise<WorkListResponse> => {
    return apiClient.get<WorkListResponse>('/api/v1/work/list/')
  },

  startWork: (): Promise<WorkStartResponse> => {
    return apiClient.post<WorkStartResponse>('/api/v1/work/start/')
  },

  stopWork: (data: WorkStopRequest): Promise<WorkStopResponse> => {
    return apiClient.post<WorkStopResponse>('/api/v1/work/stop/', data)
  },
}