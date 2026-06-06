import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function formatDistance(distance: number): string {
  const similarity = (1 - distance) * 100
  return `${similarity.toFixed(0)}%`
}

export function getSimilarityColor(distance: number): string {
  const similarity = 1 - distance
  if (similarity >= 0.85) return 'text-teal-400'
  if (similarity >= 0.7) return 'text-indigo-400'
  if (similarity >= 0.5) return 'text-amber-400'
  return 'text-red-400'
}

export function getChunkTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'function': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    case 'class': return 'bg-teal-500/10 text-teal-400 border-teal-500/20'
    case 'method': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    case 'module': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
  }
}

export function truncatePath(path: string, maxLen = 60): string {
  if (path.length <= maxLen) return path
  const parts = path.split('/')
  if (parts.length <= 2) return `...${path.slice(-maxLen)}`
  return `.../${parts.slice(-2).join('/')}`
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
