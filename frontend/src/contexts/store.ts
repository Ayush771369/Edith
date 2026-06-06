import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, Repository, RepositoryStats, SearchResult, ChatMessage } from '@/types'

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentRepository: null,
      repositoryStats: null,
      searchResults: [],
      chatHistory: [],

      setCurrentRepository: (repo: Repository | null) =>
        set({ currentRepository: repo }),

      setRepositoryStats: (stats: RepositoryStats | null) =>
        set({ repositoryStats: stats }),

      setSearchResults: (results: SearchResult[]) =>
        set({ searchResults: results }),

      addChatMessage: (message: ChatMessage) =>
        set((state) => ({
          chatHistory: [...state.chatHistory, message],
        })),

      updateChatMessage: (id: string, updates: Partial<ChatMessage>) =>
        set((state) => ({
          chatHistory: state.chatHistory.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        })),

      clearChatHistory: () => set({ chatHistory: [] }),
    }),
    {
      name: 'edith-store',
      partialize: (state) => ({
        currentRepository: state.currentRepository,
        repositoryStats: state.repositoryStats,
      }),
    }
  )
)
