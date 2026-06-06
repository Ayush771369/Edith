import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GitBranch,
  Search,
  MessageSquare,
  BookOpen,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  ChevronRight,
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils'

const FEATURES = [
  {
    icon: GitBranch,
    title: 'Repository Analysis',
    description:
      'Deep scan any GitHub repository. Extract functions, classes, and modules into a semantic knowledge base instantly.',
    accent: 'from-indigo-500 to-purple-500',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    icon: Search,
    title: 'Semantic Search',
    description:
      'Go beyond keyword matching. Find relevant code by intent and meaning using vector similarity search.',
    accent: 'from-teal-500 to-cyan-500',
    iconBg: 'bg-teal-500/10 border-teal-500/20',
    iconColor: 'text-teal-400',
  },
  {
    icon: MessageSquare,
    title: 'AI Repository Chat',
    description:
      'Ask natural language questions about any codebase. Get accurate answers grounded in the actual source code.',
    accent: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: BookOpen,
    title: 'Source Attribution',
    description:
      'Every answer is backed by precise citations. Trace responses back to the exact file, function, and line.',
    accent: 'from-rose-500 to-pink-500',
    iconBg: 'bg-rose-500/10 border-rose-500/20',
    iconColor: 'text-rose-400',
  },
]

const STATS = [
  { value: '2,488+', label: 'Files Analyzed' },
  { value: '<200ms', label: 'Search Latency' },
  { value: '99%', label: 'Accuracy' },
]

const EXAMPLE_REPOS = [
  'langchain-ai/langchain',
  'fastapi/fastapi',
  'tiangolo/sqlmodel',
  'pydantic/pydantic',
]

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-edith-bg overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-edith-accent/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-edith-teal/4 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/4 rounded-full blur-[120px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Navbar */}
      <header className="relative z-10 border-b border-edith-border glass">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-edith-text-dim hover:text-edith-text transition-colors font-body"
            >
              GitHub
            </a>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/analyze')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-edith-accent/10 border border-edith-accent/20 text-xs text-indigo-400 font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            AI-Powered Repository Intelligence
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            <span className="text-edith-text">Understand Any</span>
            <br />
            <span className="gradient-text">Codebase Instantly</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-edith-text-dim font-body max-w-2xl mx-auto leading-relaxed mb-10">
            Analyze GitHub repositories, search code semantically, and chat with your
            codebase using AI. From 2,000+ files to a single intelligent interface.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/analyze')}
              icon={<Zap className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Analyze Repository
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/analyze')}
              className="w-full sm:w-auto"
            >
              View Demo
            </Button>
          </div>

          {/* Example repos */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-edith-text-dim font-body">Try with:</span>
            {EXAMPLE_REPOS.map((repo) => (
              <button
                key={repo}
                onClick={() => navigate('/analyze')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-edith-card border border-edith-border hover:border-edith-accent/30 text-xs text-edith-text-dim hover:text-edith-text transition-all duration-200 font-mono"
              >
                <GitBranch className="w-3 h-3" />
                {repo}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-12 border-y border-edith-border">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-edith-text-dim font-body uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-edith-accent font-mono uppercase tracking-widest mb-3">
              Platform Features
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-edith-text mb-4">
              Everything you need to understand code
            </h2>
            <p className="text-edith-text-dim font-body max-w-xl mx-auto">
              A complete toolkit for developers who need to quickly understand, navigate,
              and reason about any codebase.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className={cn(
                  'group relative bg-edith-card border border-edith-border rounded-2xl p-6',
                  'hover:border-edith-accent/20 transition-all duration-300',
                  'hover:shadow-xl hover:shadow-edith-accent/5',
                  'animate-fade-in'
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl border flex items-center justify-center mb-4',
                    feature.iconBg
                  )}
                >
                  <feature.icon className={cn('w-5 h-5', feature.iconColor)} />
                </div>

                <h3 className="font-display text-lg font-semibold text-edith-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-edith-text-dim font-body leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-4 flex items-center gap-1 text-xs text-edith-text-dim group-hover:text-edith-accent transition-colors font-body">
                  <span>Learn more</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-20 px-6 border-t border-edith-border">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-edith-text mb-4">
              How Edith works
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: '01', label: 'Paste GitHub URL', desc: 'Enter any public GitHub repository URL to begin analysis.' },
              { step: '02', label: 'AI Analyzes Code', desc: 'Edith scans, parses, and embeds the entire codebase into a vector store.' },
              { step: '03', label: 'Search & Chat', desc: 'Use semantic search or chat naturally with your repository.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-edith-accent/10 border border-edith-accent/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-mono text-sm font-bold text-edith-accent">{item.step}</span>
                </div>
                <h3 className="font-display font-semibold text-edith-text mb-2">{item.label}</h3>
                <p className="text-sm text-edith-text-dim font-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="gradient-border bg-edith-card rounded-2xl p-10">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <h2 className="font-display text-3xl font-bold text-edith-text mb-4">
              Ready to explore your codebase?
            </h2>
            <p className="text-edith-text-dim font-body mb-8">
              Analyze your first repository in under 5 minutes.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/analyze')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Start Analyzing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-edith-border py-8 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="flex items-center gap-4 text-xs text-edith-text-dim font-body">
            <span>Built with FastAPI + React</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              AI-powered
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Open source
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
