import React, { useEffect, useState } from 'react'
import { cn } from '@/utils'

interface ProgressBarProps {
  isLoading: boolean
  label?: string
  className?: string
}

const STEPS = [
  'Cloning repository...',
  'Parsing file structure...',
  'Extracting code chunks...',
  'Generating embeddings...',
  'Indexing vectors...',
  'Finalizing analysis...',
]

export const AnalysisProgress: React.FC<ProgressBarProps> = ({
  isLoading,
  className,
}) => {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isLoading) {
      setStep(0)
      setProgress(0)
      return
    }

    const stepInterval = setInterval(() => {
      setStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, 4000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 3
      })
    }, 300)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className={cn('space-y-4', className)}>
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-edith-text-dim font-body">
          <span>{STEPS[step]}</span>
          <span className="font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-edith-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-edith-accent to-edith-teal rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={cn(
              'flex-1 h-0.5 rounded-full transition-all duration-500',
              i <= step ? 'bg-edith-accent' : 'bg-edith-muted'
            )}
          />
        ))}
      </div>

      <p className="text-xs text-edith-text-dim font-body text-center">
        This may take a few minutes for large repositories
      </p>
    </div>
  )
}
