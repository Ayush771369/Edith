import apiClient from './apiClient'
import type { Repository, AnalyzeRequest } from '@/types'

export const repositoryService = {
  async analyze(data: AnalyzeRequest): Promise<Repository> {
    const response = await apiClient.post<Repository>('/repositories/analyze', data)
    return response.data
  },
}
