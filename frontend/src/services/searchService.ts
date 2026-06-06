import apiClient from './apiClient'
import type { SearchResult, SearchRequest } from '@/types'

export const searchService = {
  async search(data: SearchRequest): Promise<SearchResult[]> {
    const response = await apiClient.post<SearchResult[]>('/search', data)
    return response.data
  },
}
