import {Navigate, Route, Routes, Outlet } from 'react-router'
import Index from './pages/index.tsx'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

const App = () => {
  const Protected = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      return <Navigate to='/login' replace />
    }

    return <Outlet />
  }

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      
      <Route element={<Protected />}>
        <Route path='/' element={<Index />} />
      </Route>
    </Routes>
  )
}

export default App