import '../assets/styles/globals.css'
import { useRouter } from 'next/router'
import AdminAuthProvider from '../providers/AdminAuthProvider'
import AuthProvider from '../providers/AuthProvider'

export default function App({ Component }) {
  const router = useRouter()

  if (router.route.startsWith('/admin')) {
    return <AdminAuthProvider Component={Component} />
  }

  return <AuthProvider Component={Component} />
}
