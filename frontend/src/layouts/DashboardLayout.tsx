import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAppStore } from '@/contexts/store'

export const DashboardLayout: React.FC = () => {
  const currentRepository = useAppStore((s) => s.currentRepository)

  if (!currentRepository) {
    return <Navigate to="/analyze" replace />
  }

  return (
    <div className="min-h-screen bg-edith-bg pt-14">
      <Sidebar />
      <main className="ml-60 min-h-[calc(100vh-3.5rem)] p-6">
        <Outlet />
      </main>
    </div>
  )
}
