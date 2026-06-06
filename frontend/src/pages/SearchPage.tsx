import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Search,
  FileCode2,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  Loader2,
  AlertCircle,
  SlidersHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SkeletonCard } from '@/components/ui/LoadingSpinner'
import { CodeBlock } from '@/components/common/CodeBlock'
import { searchService } from '@/services/searchService'
import { useAppStore } from '@/contexts/store'
import { cn, getChunkTypeColor, formatDistance, getSimilarityColor, truncatePath } from '@/utils'
import type { SearchResult } from '@/types'

const EXAMPLE_QUERIES = [
  'prompt generation',
  'authentication middleware',
  'database connection pooling',
  'error handling',
  'rate limiting logic',
]

const SearchResultCard: React.FC<{ result: SearchResult; index: number }> = ({
  result,
  index,
}) => {
  const [expanded, setExpanded] = useState(false)

  const similarityPct = formatDistance(result.distance)
  const similarityColor = getSimilarityColor(result.distance)
  const chunkColor = getChunkTypeColor(result.chunk_type)

  return (
    <div
      className={cn(
        'group bg-edith-card border border-edith-border rounded-xl overflow-hidden',
        'hover:border-edith-accent/20 transition-all duration-200',
        'animate-slide-up'
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Card Header */}
      <div className="px-5 py-4 flex items-start gap-4">
        {/* Rank */}
        <div className="w-7 h-7 rounded-lg bg-edith-muted flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-xs font-bold font-mono text-edith-text-dim">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-mono text-sm font-semibold text-edith-text">
              {result.chunk_name}
            </span>
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 text-xs font-mono rounded-md border',
                chunkColor
              )}
            >
              {result.chunk_type}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-edith-text-dim font-mono">
            <FileCode2 className="w-3 h-3 flex-shrink-0" />
            <span className="truncate" title={result.file_path}>
              {truncatePath(result.file_path)}
            </span>
          </div>
        </div>

        {/* Similarity score */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <Fingerprint className={cn('w-3.5 h-3.5', similarityColor)} />
            <span className={cn('text-sm font-bold font-mono', similarityColor)}>
              {similarityPct}
            </span>
          </div>
          <span className="text-xs text-edith-text-dim font-body">similarity</span>
        </div>
      </div>

      {/* Preview section */}
      {result.preview && (
        <div className="border-t border-edith-border">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-5 py-2.5 text-xs text-edith-text-dim hover:text-edith-text transition-colors font-body"
          >
            <span>Code Preview</span>
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {expanded && (
            <div className="px-5 pb-4 animate-fade-in">
              <CodeBlock
                code={result.preview}
                fileName={result.file_path.split('/').pop()}
                maxHeight="200px"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const currentRepository = useAppStore((s) => s.currentRepository)
  const searchResults = useAppStore((s) => s.searchResults)
  const setSearchResults = useAppStore((s) => s.setSearchResults)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(async () => {
    if (!query.trim() || !currentRepository) return

    setError(null)
    setIsLoading(true)
    setHasSearched(true)

    try {
      const results = await searchService.search({
        repository_id: currentRepository.repository_id,
        query: query.trim(),
      })
      setSearchResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [currentRepository, query, setSearchResults])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) handleSearch()
  }

  const handleExampleClick = (example: string) => {
    setQuery(example)
    inputRef.current?.focus()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-edith-text mb-1">
          Semantic Search
        </h1>
        <p className="text-sm text-edith-text-dim font-body">
          Search{' '}
          <span className="text-edith-accent font-mono">
            {currentRepository?.repository_name}
          </span>{' '}
          by meaning and intent
        </p>
      </div>

      {/* Search Input */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-edith-text-dim pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={inputRef}
              placeholder="e.g. 'prompt generation logic' or 'database connection handling'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="w-full bg-edith-card border border-edith-border rounded-lg text-edith-text placeholder:text-edith-text-dim/60 focus:outline-none focus:ring-2 focus:ring-edith-accent/40 focus:border-edith-accent/50 transition-all duration-200 font-body text-sm pl-10 pr-4 py-2.5 disabled:opacity-60"
            />
          </div>
          <Button
            variant="primary"
            onClick={handleSearch}
            loading={isLoading}
            disabled={!query.trim()}
            icon={<Search className="w-4 h-4" />}
            className="flex-shrink-0"
          >
            Search
          </Button>
        </div>

        {/* Example queries */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-edith-text-dim font-body">Try:</span>
          {EXAMPLE_QUERIES.map((ex) => (
            <button
              key={ex}
              onClick={() => handleExampleClick(ex)}
              className="text-xs px-2.5 py-1 rounded-md bg-edith-muted/60 hover:bg-edith-muted text-edith-text-dim hover:text-edith-text transition-colors font-body"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-400 font-body">Search failed</p>
                <p className="text-xs text-red-400/70 font-body mt-0.5">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!isLoading && !error && hasSearched && (
        <div className="space-y-4">
          {/* Results meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="accent">
                {searchResults.length} results
              </Badge>
              <span className="text-xs text-edith-text-dim font-body">
                for "{query}"
              </span>
            </div>
            {searchResults.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-edith-text-dim font-body">
                <SlidersHorizontal className="w-3 h-3" />
                Ranked by similarity
              </div>
            )}
          </div>

          {/* No results */}
          {searchResults.length === 0 && (
            <Card>
              <CardContent className="text-center py-10">
                <Search className="w-10 h-10 text-edith-text-dim/30 mx-auto mb-3" />
                <p className="text-sm text-edith-text-dim font-body">
                  No results found for "{query}"
                </p>
                <p className="text-xs text-edith-text-dim/60 font-body mt-1">
                  Try different keywords or a more specific query
                </p>
              </CardContent>
            </Card>
          )}

          {/* Result list */}
          {searchResults.map((result, i) => (
            <SearchResultCard key={`${result.chunk_name}-${i}`} result={result} index={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !hasSearched && (
        <Card className="border-dashed">
          <CardContent className="text-center py-14">
            <div className="w-14 h-14 rounded-2xl bg-edith-accent/10 border border-edith-accent/20 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-edith-accent/60" />
            </div>
            <p className="font-display font-semibold text-edith-text mb-2">
              Semantic Code Search
            </p>
            <p className="text-sm text-edith-text-dim font-body max-w-sm mx-auto">
              Search for functions, classes, and code patterns using natural language.
              Results are ranked by semantic similarity.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
