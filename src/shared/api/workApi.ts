import { apiClient } from './client'
import {
  WorkListResponse,
  WorkStartRequest,
  WorkStartResponse,
  WorkStopRequest,
  WorkStopResponse,
} from './types'

export const workApi = {
  getWorkList: (): Promise<WorkListResponse> => {
    return apiClient.get<WorkListResponse>('/api/v1/work/list')
  },

  startWork: (data: WorkStartRequest): Promise<WorkStartResponse> => {
    return apiClient.post<WorkStartResponse>('/api/v1/work/start', data)
  },

  stopWork: (data: WorkStopRequest): Promise<WorkStopResponse> => {
    return apiClient.post<WorkStopResponse>('/api/v1/work/stop', data)
  },
}