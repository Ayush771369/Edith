import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/utils'

interface CodeBlockProps {
  code: string
  language?: string
  fileName?: string
  className?: string
  maxHeight?: string
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  fileName,
  className,
  maxHeight = '240px',
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'bg-edith-bg border border-edith-border rounded-lg overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-edith-border bg-edith-surface">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500/60" />
          </div>
          {fileName && (
            <span className="text-xs text-edith-text-dim font-mono ml-2">
              {fileName}
            </span>
          )}
          {!fileName && language && (
            <span className="text-xs text-edith-text-dim font-mono ml-2 uppercase tracking-wider">
              {language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="text-edith-text-dim hover:text-edith-text transition-colors p-1 rounded"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-teal-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Code */}
      <div
        className="overflow-auto"
        style={{ maxHeight }}
      >
        <pre className="p-4 text-xs leading-relaxed">
          <code className="font-mono text-edith-text/90 whitespace-pre">{code}</code>
        </pre>
      </div>
    </div>
  )
}
