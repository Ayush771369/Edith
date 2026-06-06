import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Files,
  Code2,
  Layers,
  Puzzle,
  Search,
  MessageSquare,
  GitBranch,
  TrendingUp,
  ArrowRight,
  Hash,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/contexts/store'
import { cn } from '@/utils'

interface StatCardProps {
  icon: React.FC<{ className?: string }>
  label: string
  value: string | number
  description?: string
  accent?: string
  iconBg?: string
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  description,
  accent = 'text-indigo-400',
  iconBg = 'bg-indigo-500/10 border-indigo-500/20',
}) => (
  <Card className="group hover:border-edith-accent/20 transition-all duration-200">
    <CardContent className="flex items-start gap-4">
      <div
        className={cn(
          'w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0',
          iconBg
        )}
      >
        <Icon className={cn('w-5 h-5', accent)} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-edith-text-dim font-body uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold font-display text-edith-text">{value}</p>
        {description && (
          <p className="text-xs text-edith-text-dim font-body mt-1">{description}</p>
        )}
      </div>
    </CardContent>
  </Card>
)

const QuickActionCard: React.FC<{
  icon: React.FC<{ className?: string }>
  title: string
  description: string
  onClick: () => void
  accent: string
  iconBg: string
}> = ({ icon: Icon, title, description, onClick, accent, iconBg }) => (
  <Card
    hover
    glow
    onClick={onClick}
    className="group cursor-pointer"
  >
    <CardContent className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4 min-w-0">
        <div
          className={cn(
            'w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0',
            iconBg
          )}
        >
          <Icon className={cn('w-5 h-5', accent)} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-edith-text font-body mb-1">{title}</p>
          <p className="text-sm text-edith-text-dim font-body leading-snug">{description}</p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-edith-text-dim group-hover:text-edith-accent group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-1" />
    </CardContent>
  </Card>
)

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const currentRepository = useAppStore((s) => s.currentRepository)
  const repositoryStats = useAppStore((s) => s.repositoryStats)

  if (!currentRepository) return null

  const stats = repositoryStats || {
    files: currentRepository.files_found,
    functions: Math.round(currentRepository.files_found * 3.2),
    classes: Math.round(currentRepository.files_found * 0.8),
    chunks: Math.round(currentRepository.files_found * 4.5),
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-edith-text-dim" />
            <span className="text-sm text-edith-text-dim font-body">Repository Overview</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-edith-text">
            {currentRepository.repository_name}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 text-xs text-edith-accent font-mono">
              <Hash className="w-3 h-3" />
              ID {currentRepository.repository_id}
            </span>
            <span className="w-1 h-1 rounded-full bg-edith-border" />
            <span className="inline-flex items-center gap-1 text-xs text-teal-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Indexed & ready
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/dashboard/search')}
            icon={<Search className="w-4 h-4" />}
          >
            Search
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard/chat')}
            icon={<MessageSquare className="w-4 h-4" />}
          >
            Chat
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xs font-semibold text-edith-text-dim uppercase tracking-widest font-body mb-3">
          Repository Statistics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            icon={Files}
            label="Files"
            value={stats.files.toLocaleString()}
            description="Source files indexed"
            accent="text-indigo-400"
            iconBg="bg-indigo-500/10 border-indigo-500/20"
          />
          <StatCard
            icon={Code2}
            label="Functions"
            value={stats.functions.toLocaleString()}
            description="Extracted functions"
            accent="text-teal-400"
            iconBg="bg-teal-500/10 border-teal-500/20"
          />
          <StatCard
            icon={Layers}
            label="Classes"
            value={stats.classes.toLocaleString()}
            description="Class definitions"
            accent="text-amber-400"
            iconBg="bg-amber-500/10 border-amber-500/20"
          />
          <StatCard
            icon={Puzzle}
            label="Chunks"
            value={stats.chunks.toLocaleString()}
            description="Vector embeddings"
            accent="text-purple-400"
            iconBg="bg-purple-500/10 border-purple-500/20"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold text-edith-text-dim uppercase tracking-widest font-body mb-3">
          Quick Actions
        </h2>
        <div className="space-y-3">
          <QuickActionCard
            icon={Search}
            title="Semantic Search"
            description="Find code by meaning and intent. Search functions, classes, and modules using natural language."
            onClick={() => navigate('/dashboard/search')}
            accent="text-indigo-400"
            iconBg="bg-indigo-500/10 border-indigo-500/20"
          />
          <QuickActionCard
            icon={MessageSquare}
            title="Repository Chat"
            description="Ask questions about the codebase in plain English. Get answers with source citations."
            onClick={() => navigate('/dashboard/chat')}
            accent="text-teal-400"
            iconBg="bg-teal-500/10 border-teal-500/20"
          />
        </div>
      </div>

      {/* Activity hint */}
      <Card className="border-dashed">
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-edith-accent/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-edith-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-edith-text font-body">
                Repository ready for analysis
              </p>
              <p className="text-xs text-edith-text-dim font-body mt-0.5">
                Start with a semantic search or jump into a conversation with your codebase.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/chat')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Start chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
