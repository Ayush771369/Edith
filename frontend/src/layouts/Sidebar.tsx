import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  MessageSquare,
  FolderGit2,
  ChevronRight,
  Files,
  PlusCircle,
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { useAppStore } from '@/contexts/store'
import { cn } from '@/utils'

const NAV_ITEMS = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    to: '/dashboard',
    end: true,
  },
  {
    label: 'Semantic Search',
    icon: Search,
    to: '/dashboard/search',
  },
  {
    label: 'Repository Chat',
    icon: MessageSquare,
    to: '/dashboard/chat',
  },
]

export const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const currentRepository = useAppStore((s) => s.currentRepository)

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-60 bg-edith-surface border-r border-edith-border flex flex-col">
      {/* Repository Info */}
      <div className="p-4 border-b border-edith-border">
        {currentRepository ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <FolderGit2 className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-edith-text font-mono truncate">
                  {currentRepository.repository_name}
                </p>
                <p className="text-xs text-edith-text-dim font-body">
                  ID #{currentRepository.repository_id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-edith-text-dim font-body pl-9">
              <Files className="w-3 h-3" />
              <span>{currentRepository.files_found.toLocaleString()} files indexed</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-edith-text-dim font-body">No repository selected</div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-edith-text-dim uppercase tracking-widest font-body">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all duration-150 group',
                isActive
                  ? 'bg-edith-accent/10 text-edith-accent border border-edith-accent/20'
                  : 'text-edith-text-dim hover:text-edith-text hover:bg-edith-muted/60'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0 transition-colors',
                    isActive ? 'text-edith-accent' : 'text-edith-text-dim group-hover:text-edith-text'
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-edith-accent/60" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Action */}
      <div className="p-3 border-t border-edith-border">
        <button
          onClick={() => navigate('/analyze')}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-edith-text-dim hover:text-edith-accent hover:bg-edith-accent/5 transition-all duration-150 font-body group"
        >
          <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>Analyze New Repo</span>
        </button>
      </div>
    </aside>
  )
}
