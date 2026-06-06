import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-edith-bg flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md animate-fade-in">
        <Logo size="lg" className="justify-center" />

        <div>
          <p className="font-mono text-6xl font-bold gradient-text mb-3">404</p>
          <h1 className="font-display text-2xl font-bold text-edith-text mb-2">
            Page not found
          </h1>
          <p className="text-sm text-edith-text-dim font-body">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            variant="ghost"
            size="md"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Go back
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/')}
            icon={<Home className="w-4 h-4" />}
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  )
}
