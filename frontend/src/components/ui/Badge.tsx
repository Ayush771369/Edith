import React from 'react'
import { cn } from '@/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error'
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
}) => {
  const variants = {
    default: 'bg-edith-muted text-edith-text-dim border-edith-border',
    accent: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    success: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5',
        'text-xs font-medium font-mono rounded-md border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
