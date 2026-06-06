import React from 'react'
import { cn } from '@/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  glow = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-edith-card border border-edith-border rounded-xl',
        hover && 'hover:border-edith-accent/30 hover:bg-edith-card/80 transition-all duration-200 cursor-pointer',
        glow && 'hover:shadow-lg hover:shadow-edith-accent/10',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('px-6 py-4 border-b border-edith-border', className)}>
    {children}
  </div>
)

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('px-6 py-5', className)}>
    {children}
  </div>
)

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('px-6 py-4 border-t border-edith-border', className)}>
    {children}
  </div>
)
