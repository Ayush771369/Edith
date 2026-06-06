import React from 'react'
import { cn } from '@/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  hint?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  hint,
  className,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-edith-text-dim font-body">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-edith-text-dim pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full bg-edith-card border border-edith-border rounded-lg',
            'text-edith-text placeholder:text-edith-text-dim/60',
            'focus:outline-none focus:ring-2 focus:ring-edith-accent/40 focus:border-edith-accent/50',
            'transition-all duration-200 font-body text-sm',
            icon && iconPosition === 'left' ? 'pl-10 pr-4 py-2.5' : 'px-4 py-2.5',
            icon && iconPosition === 'right' ? 'pr-10' : '',
            error && 'border-red-500/50 focus:ring-red-500/40',
            className
          )}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-edith-text-dim pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-400 font-body">{error}</p>}
      {hint && !error && (
        <p className="text-xs text-edith-text-dim font-body">{hint}</p>
      )}
    </div>
  )
}
