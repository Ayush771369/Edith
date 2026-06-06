// Repository types
export interface Repository {
  repository_id: number
  repository_name: string
  files_found: number
  status: string
}

export interface AnalyzeRequest {
  github_url: string
}

// Search types
export interface SearchResult {
  chunk_name: string
  chunk_type: 'function' | 'class' | 'module' | 'method' | string
  file_path: string
  preview: string
  distance: number
}

export interface SearchRequest {
  repository_id: number
  query: string
}

// Chat types
export interface ChatSource {
  file: string
  chunk: string
  chunk_type: string
  distance: number
  content?: string
}

export interface ChatResponse {
  answer: string
  sources: ChatSource[]
}

export interface ChatRequest {
  repository_id: number
  query: string
  history: ChatHistoryItem[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
  timestamp: Date
  isLoading?: boolean
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
  timestamp: Date
}

// Dashboard stats (derived from repository analysis)
export interface RepositoryStats {
  files: number
  functions: number
  classes: number
  chunks: number
}

// App state
export interface AppState {
  currentRepository: Repository | null
  repositoryStats: RepositoryStats | null
  searchResults: SearchResult[]
  chatHistory: ChatMessage[]
  setCurrentRepository: (repo: Repository | null) => void
  setRepositoryStats: (stats: RepositoryStats | null) => void
  setSearchResults: (results: SearchResult[]) => void
  addChatMessage: (message: ChatMessage) => void
  updateChatMessage: (id: string, updates: Partial<ChatMessage>) => void
  clearChatHistory: () => void
}
