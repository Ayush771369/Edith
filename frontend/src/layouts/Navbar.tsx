import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Github, ExternalLink } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { useAppStore } from '@/contexts/store'
import { cn } from '@/utils'

export const Navbar: React.FC = () => {
  const location = useLocation()
  const currentRepository = useAppStore((s) => s.currentRepository)

  const isLanding = location.pathname === '/'
  const isAnalyze = location.pathname === '/analyze'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-14',
        'border-b border-edith-border glass',
        'transition-all duration-300'
      )}
    >
      <div className="max-w-screen-xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Left */}
        <Link to="/" className="flex-shrink-0">
          <Logo size="sm" />
        </Link>

        {/* Center - breadcrumb when on dashboard */}
        {currentRepository && !isLanding && !isAnalyze && (
          <div className="hidden md:flex items-center gap-2 text-sm font-body">
            <span className="text-edith-text-dim">Repository</span>
            <span className="text-edith-border">/</span>
            <span className="text-edith-text font-medium font-mono">
              {currentRepository.repository_name}
            </span>
            <span className="ml-2 px-2 py-0.5 text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-md font-mono">
              #{currentRepository.repository_id}
            </span>
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-3">
          {!isAnalyze && !currentRepository && (
            <Link
              to="/analyze"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-edith-text-dim hover:text-edith-text transition-colors font-body"
            >
              Analyze Repo
            </Link>
          )}
          {currentRepository && !isLanding && (
            <Link
              to="/analyze"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-edith-text-dim hover:text-edith-accent transition-colors font-body border border-edith-border rounded-lg"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              New Repo
            </Link>
          )}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-edith-card border border-edith-border flex items-center justify-center text-edith-text-dim hover:text-edith-text hover:border-edith-accent/30 transition-all duration-200"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  )
}
