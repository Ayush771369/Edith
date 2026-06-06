import React from 'react'
import { cn } from '@/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  label,
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  }

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative">
        <div
          className={cn(
            'rounded-full border-2 border-edith-border',
            sizes[size]
          )}
        />
        <div
          className={cn(
            'absolute inset-0 rounded-full border-2 border-transparent border-t-edith-accent animate-spin',
            sizes[size]
          )}
        />
      </div>
      {label && (
        <p className="text-sm text-edith-text-dim font-body animate-pulse">{label}</p>
      )}
    </div>
  )
}

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-edith-card border border-edith-border rounded-xl p-5 space-y-3', className)}>
    <div className="h-4 w-2/3 rounded bg-edith-muted animate-pulse" />
    <div className="h-3 w-1/3 rounded bg-edith-muted/60 animate-pulse" />
    <div className="space-y-2 pt-2">
      <div className="h-3 w-full rounded bg-edith-muted/50 animate-pulse" />
      <div className="h-3 w-5/6 rounded bg-edith-muted/40 animate-pulse" />
      <div className="h-3 w-4/6 rounded bg-edith-muted/30 animate-pulse" />
    </div>
  </div>
)
