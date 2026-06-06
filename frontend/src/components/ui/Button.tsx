import React from 'react'
import { cn } from '@/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className,
  disabled,
  ...props
}) => {
  const variants = {
    primary:
      'bg-edith-accent hover:bg-edith-accent-dim text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30',
    secondary:
      'bg-edith-card hover:bg-edith-muted text-edith-text border border-edith-border',
    ghost:
      'bg-transparent hover:bg-edith-muted text-edith-text-dim hover:text-edith-text',
    danger:
      'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
    outline:
      'bg-transparent border border-edith-accent text-edith-accent hover:bg-edith-accent/10',
  }

  const sizes = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-body font-medium rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-edith-accent/40 focus:ring-offset-2 focus:ring-offset-edith-bg',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && iconPosition === 'left' && icon
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  )
}
