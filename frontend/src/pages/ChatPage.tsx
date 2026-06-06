import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send,
  Bot,
  User,
  FileCode2,
  ChevronDown,
  ChevronUp,
  Trash2,
  Fingerprint,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { chatService } from '@/services/chatService'
import { useAppStore } from '@/contexts/store'
import { cn, generateId, formatTimestamp, getSimilarityColor, formatDistance, truncatePath } from '@/utils'
import type { ChatMessage, ChatSource } from '@/types'

const STARTER_PROMPTS = [
  'How is this project structured?',
  'What are the main entry points?',
  'How does authentication work?',
  'Show me how errors are handled',
  'Explain the database layer',
]

// Sources accordion component
const SourcesPanel: React.FC<{ sources: ChatSource[] }> = ({ sources }) => {
  const [open, setOpen] = useState(false)
  const [selectedSource, setSelectedSource] = useState<ChatSource | null>(null)

  return (
    <div className="mt-3 border-t border-edith-border/60 pt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs text-edith-text-dim hover:text-edith-text transition-colors font-body w-full"
      >
        <FileCode2 className="w-3.5 h-3.5" />
        <span className="font-medium">{sources.length} source{sources.length !== 1 ? 's' : ''} cited</span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 ml-auto" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 ml-auto" />
        )}
      </button>

      {open && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {sources.map((source, i) => {
            const simColor = getSimilarityColor(source.distance)
            const simPct = formatDistance(source.distance)
            return (
              <div
                key={i}
                onClick={() => setSelectedSource(source)}
                className="
                flex items-start gap-3 p-3 rounded-lg
                bg-edith-bg/60
                border border-edith-border/40
                cursor-pointer
                hover:border-edith-accent/50
                hover:bg-edith-card
                transition-all
              "
              >
                <div className="w-6 h-6 rounded-md bg-edith-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold font-mono text-edith-accent">{i + 1}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-mono font-medium text-edith-text">
                      {source.chunk}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-edith-muted text-edith-text-dim font-mono">
                      {source.chunk_type}
                    </span>
                  </div>
                  <p
                    className="text-xs font-mono text-edith-text-dim truncate"
                    title={source.file}
                  >
                    {truncatePath(source.file, 50)}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Fingerprint className={cn('w-3 h-3', simColor)} />
                  <span className={cn('text-xs font-mono font-bold', simColor)}>{simPct}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
      {selectedSource && (
  <div
    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
    onClick={() => setSelectedSource(null)}
  >
    <div
      className="bg-edith-card border border-edith-border rounded-xl max-w-4xl w-full max-h-[80vh] overflow-auto p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="font-bold text-lg mb-2">
        {selectedSource.chunk}
      </h3>

      <p className="text-xs text-edith-text-dim mb-4">
        {selectedSource.file}
      </p>

      <pre className="text-xs overflow-auto bg-edith-bg p-4 rounded-lg">
        <code>
          {selectedSource.content}
        </code>
      </pre>

      <button
        onClick={() => setSelectedSource(null)}
        className="mt-4 px-4 py-2 rounded-lg bg-edith-accent"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  )
}

// Individual message component
const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 group">
        <div className="max-w-[75%]">
          <div className="bg-edith-accent/20 border border-edith-accent/20 rounded-2xl rounded-tr-sm px-4 py-3">
            <p className="text-sm text-edith-text font-body leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-xs text-edith-text-dim font-body opacity-0 group-hover:opacity-100 transition-opacity">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-edith-accent flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 group">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-indigo-500/20">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0 max-w-[85%]">
        <div className="bg-edith-card border border-edith-border rounded-2xl rounded-tl-sm px-4 py-3">
          {message.isLoading ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-edith-accent animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <span className="text-xs text-edith-text-dim font-body">Thinking...</span>
            </div>
          ) : (
            <>
              <div className="prose-edith text-sm text-edith-text font-body leading-relaxed">
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className={cn('whitespace-pre-wrap', i > 0 && 'mt-2')}>
                    {line}
                  </p>
                ))}
              </div>

              {message.sources && message.sources.length > 0 && (
                <SourcesPanel sources={message.sources} />
              )}
            </>
          )}
        </div>

        {!message.isLoading && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-edith-text-dim font-body opacity-0 group-hover:opacity-100 transition-opacity">
              {formatTimestamp(message.timestamp)}
            </span>
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-edith-text-dim hover:text-edith-text p-0.5 rounded"
            >
              {copied ? (
                <Check className="w-3 h-3 text-teal-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Main Chat Page
export const ChatPage: React.FC = () => {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const currentRepository = useAppStore((s) => s.currentRepository)
  const chatHistory = useAppStore((s) => s.chatHistory)
  const addChatMessage = useAppStore((s) => s.addChatMessage)
  const updateChatMessage = useAppStore((s) => s.updateChatMessage)
  const clearChatHistory = useAppStore((s) => s.clearChatHistory)

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, scrollToBottom])

  const handleSend = async () => {
    if (!query.trim() || isLoading || !currentRepository) return

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date(),
    }

    const loadingId = generateId()
    const loadingMsg: ChatMessage = {
      id: loadingId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    }

    addChatMessage(userMsg)
    addChatMessage(loadingMsg)
    setQuery('')
    setIsLoading(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const response = await chatService.chat({
        repository_id: currentRepository.repository_id,
        query: userMsg.content,

        history: chatHistory
          .filter((msg) => !msg.isLoading)
          .slice(-6)
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
            sources: msg.sources,
            timestamp: msg.timestamp,
          })),
      })

      updateChatMessage(loadingId, {
        content: response.answer,
        sources: response.sources,
        isLoading: false,
      })
    } catch (err) {
      updateChatMessage(loadingId, {
        content: err instanceof Error
          ? `Error: ${err.message}`
          : 'Sorry, something went wrong. Please try again.',
        isLoading: false,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
  }

  const handleStarterPrompt = (prompt: string) => {
    setQuery(prompt)
    textareaRef.current?.focus()
  }

  const isEmpty = chatHistory.length === 0

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-3rem)] max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="font-display text-2xl font-bold text-edith-text">
            Repository Chat
          </h1>
          <p className="text-sm text-edith-text-dim font-body">
            Chat with{' '}
            <span className="text-edith-accent font-mono">
              {currentRepository?.repository_name}
            </span>
          </p>
        </div>
        {!isEmpty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChatHistory}
            icon={<Trash2 className="w-3.5 h-3.5" />}
            className="text-edith-text-dim hover:text-red-400"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-5 pb-4 pr-1">
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border border-indigo-500/20 flex items-center justify-center mb-5">
              <MessageSquare className="w-8 h-8 text-indigo-400/70" />
            </div>
            <h2 className="font-display text-xl font-semibold text-edith-text mb-2">
              Start a conversation
            </h2>
            <p className="text-sm text-edith-text-dim font-body max-w-sm mb-8">
              Ask anything about the{' '}
              <span className="text-edith-accent font-mono">
                {currentRepository?.repository_name}
              </span>{' '}
              codebase. I'll find the relevant code and explain it.
            </p>

            {/* Starter prompts */}
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleStarterPrompt(prompt)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-body',
                    'bg-edith-card border border-edith-border',
                    'hover:border-edith-accent/30 hover:text-edith-accent',
                    'text-edith-text-dim transition-all duration-200'
                  )}
                >
                  <Sparkles className="w-3 h-3" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message list */
          <>
            {chatHistory.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={scrollRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 pt-3 border-t border-edith-border">
        <div className="relative bg-edith-card border border-edith-border rounded-2xl overflow-hidden focus-within:border-edith-accent/50 focus-within:ring-2 focus-within:ring-edith-accent/20 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={query}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${currentRepository?.repository_name}...`}
            disabled={isLoading}
            rows={1}
            className={cn(
              'w-full bg-transparent px-4 pt-3.5 pb-2 pr-14',
              'text-sm text-edith-text placeholder:text-edith-text-dim/60',
              'resize-none focus:outline-none font-body',
              'disabled:opacity-60 min-h-[52px] max-h-[160px]'
            )}
            style={{ height: 'auto' }}
          />
          <div className="absolute bottom-2.5 right-3 flex items-center gap-2">
            <span className="text-xs text-edith-text-dim/40 font-mono hidden sm:block">
              {isLoading ? '' : '↵'}
            </span>
            <button
              onClick={handleSend}
              disabled={!query.trim() || isLoading}
              className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200',
                query.trim() && !isLoading
                  ? 'bg-edith-accent hover:bg-edith-accent-dim text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-edith-muted text-edith-text-dim cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-edith-text-dim/40 font-body mt-2">
          Answers are grounded in the actual source code. Press Shift+Enter for new line.
        </p>
      </div>
    </div>
  )
}
