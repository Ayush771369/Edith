import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GitBranch,
  ArrowRight,
  CheckCircle2,
  Files,
  Hash,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'
import { AnalysisProgress } from '@/components/common/ProgressBar'
import { repositoryService } from '@/services/repositoryService'
import { useAppStore } from '@/contexts/store'
import type { Repository } from '@/types'
import { cn } from '@/utils'

const EXAMPLE_URLS = [
  'https://github.com/langchain-ai/langchain',
  'https://github.com/fastapi/fastapi',
  'https://github.com/tiangolo/sqlmodel',
  'https://github.com/pydantic/pydantic',
]

export const AnalyzePage: React.FC = () => {
  const navigate = useNavigate()
  const setCurrentRepository = useAppStore((s) => s.setCurrentRepository)
  const clearChatHistory = useAppStore((s) => s.clearChatHistory)
  const setSearchResults = useAppStore((s) => s.setSearchResults)

  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Repository | null>(null)

  const validateUrl = (value: string): boolean => {
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/
    return githubPattern.test(value.trim())
  }

  const handleAnalyze = async () => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      setError('Please enter a GitHub repository URL')
      return
    }
    if (!validateUrl(trimmedUrl)) {
      setError('Please enter a valid GitHub repository URL (e.g. https://github.com/owner/repo)')
      return
    }

    setError(null)
    setIsLoading(true)
    setResult(null)

    try {
      const data = await repositoryService.analyze({ github_url: trimmedUrl })
      setResult(data)
      setCurrentRepository(data)
      clearChatHistory()
      setSearchResults([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) handleAnalyze()
  }

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-edith-bg pt-14 flex items-center justify-center px-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-edith-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-xl space-y-6 animate-slide-up">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="font-display text-3xl font-bold text-edith-text">
            Analyze Repository
          </h1>
          <p className="text-sm text-edith-text-dim font-body">
            Paste a GitHub URL to begin semantic analysis
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl shadow-black/30">
          <CardContent className="space-y-5">
            {/* URL Input */}
            <div className="space-y-3">
              <Input
                label="GitHub Repository URL"
                placeholder="https://github.com/owner/repository"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  setError(null)
                }}
                onKeyDown={handleKeyDown}
                icon={<GitBranch className="w-4 h-4" />}
                error={error || undefined}
                disabled={isLoading}
                hint="Supports any public GitHub repository"
              />

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                loading={isLoading}
                onClick={handleAnalyze}
                icon={<Sparkles className="w-4 h-4" />}
              >
                {isLoading ? 'Analyzing Repository...' : 'Analyze Repository'}
              </Button>
            </div>

            {/* Progress */}
            {isLoading && (
              <div className="pt-2">
                <AnalysisProgress isLoading={isLoading} />
              </div>
            )}

            {/* Success Result */}
            {result && !isLoading && (
              <div className="animate-slide-up">
                <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 space-y-4">
                  {/* Success header */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-teal-400 font-body">
                        Analysis complete!
                      </p>
                      <p className="text-xs text-edith-text-dim font-body mt-0.5">
                        {result.status}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-edith-bg/60 rounded-lg p-3 text-center">
                      <p className="text-xs text-edith-text-dim font-body mb-1">Repository</p>
                      <p className="text-sm font-semibold text-edith-text font-mono truncate">
                        {result.repository_name}
                      </p>
                    </div>
                    <div className="bg-edith-bg/60 rounded-lg p-3 text-center">
                      <p className="text-xs text-edith-text-dim font-body mb-1">ID</p>
                      <div className="flex items-center justify-center gap-1">
                        <Hash className="w-3 h-3 text-edith-accent" />
                        <p className="text-sm font-semibold text-edith-text font-mono">
                          {result.repository_id}
                        </p>
                      </div>
                    </div>
                    <div className="bg-edith-bg/60 rounded-lg p-3 text-center">
                      <p className="text-xs text-edith-text-dim font-body mb-1">Files</p>
                      <div className="flex items-center justify-center gap-1">
                        <Files className="w-3 h-3 text-edith-accent" />
                        <p className="text-sm font-semibold text-edith-text font-mono">
                          {result.files_found.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => navigate('/dashboard')}
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Open Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Example repos */}
        <div className="space-y-2">
          <p className="text-xs text-center text-edith-text-dim font-body uppercase tracking-wider">
            Example repositories
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_URLS.map((exUrl) => {
              const parts = exUrl.replace('https://github.com/', '').split('/')
              const display = parts.join('/')
              return (
                <button
                  key={exUrl}
                  onClick={() => handleExampleClick(exUrl)}
                  disabled={isLoading}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono',
                    'bg-edith-card border border-edith-border',
                    'hover:border-edith-accent/30 hover:text-edith-accent',
                    'text-edith-text-dim transition-all duration-200',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <ExternalLink className="w-3 h-3" />
                  {display}
                </button>
              )
            })}
          </div>
        </div>

        {/* Error state for connection issues */}
        {error && error.includes('Network') && (
          <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-400/80 font-body">
              <p className="font-medium mb-0.5">Backend connection issue</p>
              <p>Make sure your FastAPI server is running on localhost:8000</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
