import { Navigate, Outlet } from 'react-router-dom'

import { Loader2 } from 'lucide-react'
import useAuth from '@/hooks/use-auth'

const AuthContainer = () => {
  const { user, isPending } = useAuth()
  if (isPending) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    )
  }
  return user ? <Outlet /> : <Navigate to="/signin" replace />
}

export default AuthContainer
