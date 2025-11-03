import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { queryClient } from './api/client'

import NotFound from './pages/not-found'
import { QueryClientProvider } from '@tanstack/react-query'
import AuthContainer from './components/auth/auth-container'
import LoginPage from './pages/login'
import GoogleCallback from './components/auth/google-callback'
import Index from './pages'
import Dashboard from './pages/dashboard'

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/google/callback" element={<GoogleCallback />} />
        {/* PROTECTED ROUTES */}
        <Route path="/" element={<AuthContainer />}>
          <Route path="" element={<Index />}>
            {/* ADD ALL PROTECTED ROUTES HERE */}
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
)

export default App
