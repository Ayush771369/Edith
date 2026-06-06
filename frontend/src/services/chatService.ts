import apiClient from './apiClient'
import type { ChatResponse, ChatRequest } from '@/types'

export const chatService = {
  async chat(data: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>('/chat', data)
    return response.data
  },
}
