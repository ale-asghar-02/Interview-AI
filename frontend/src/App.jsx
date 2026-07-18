import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from './appRoute'
import { AuthProvider } from './features/auth/AuthContext'
import { InterviewProvider } from './features/interview/InterviewContext'
import ErrorBoundary from './components/ErrorBoundary'
import { Toaster } from 'sonner'

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <InterviewProvider>
          <Toaster position="bottom-right" richColors />
          <RouterProvider router={router} />
        </InterviewProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App