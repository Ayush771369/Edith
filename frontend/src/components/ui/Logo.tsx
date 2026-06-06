import React from 'react'
import { cn } from '@/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  }

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'rounded-lg flex items-center justify-center font-display font-bold text-white',
          'bg-gradient-to-br from-indigo-500 to-teal-500 shadow-lg shadow-indigo-500/20',
          iconSizes[size]
        )}
      >
        E
      </div>
      {showText && (
        <span
          className={cn(
            'font-display font-bold tracking-tight',
            'bg-gradient-to-r from-edith-text to-edith-text-dim bg-clip-text text-transparent',
            textSizes[size]
          )}
        >
          Edith
        </span>
      )}
    </div>
  )
}
