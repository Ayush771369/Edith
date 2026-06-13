import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from '@/layouts/Navbar'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { LandingPage } from '@/pages/LandingPage'
import { AnalyzePage } from '@/pages/AnalyzePage'
import { DashboardPage } from '@/pages/DashboardPage'
import { SearchPage } from '@/pages/SearchPage'
import { ChatPage } from '@/pages/ChatPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RepositoryExplorerPage } from '@/pages/RepositoryExplorerPage'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing - has its own navbar */}
        <Route path="/" element={<LandingPage />} />

        {/* Analyze - uses global navbar */}
        <Route
          path="/analyze"
          element={
            <>
              <Navbar />
              <AnalyzePage />
            </>
          }
        />

        {/* Dashboard - uses sidebar layout */}
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <DashboardLayout />
            </>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="explorer" element={<RepositoryExplorerPage />} />
        </Route>

        {/* 404 */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
