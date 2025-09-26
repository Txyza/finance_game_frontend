import { apiClient } from './client'
import {
  WorkListResponse,
  WorkStartResponse,
  WorkStopRequest,
  WorkStopResponse,
} from './types'

export const workApi = {
  getWorkList: (): Promise<WorkListResponse> => {
    return apiClient.get<WorkListResponse>('/api/work/list')
  },

  startWork: (): Promise<WorkStartResponse> => {
    return apiClient.post<WorkStartResponse>('/api/work/start')
  },

  stopWork: (data: WorkStopRequest): Promise<WorkStopResponse> => {
    return apiClient.post<WorkStopResponse>('/api/work/stop', data)
  },
}