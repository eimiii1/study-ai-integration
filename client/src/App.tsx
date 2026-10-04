import {Navigate, Route, Routes, Outlet } from 'react-router'
import Index from './pages'
import Auth from './pages/auth/Auth'

const App = () => {
  const Protected = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      return <Navigate to='/auth' replace />
    }

    return <Outlet />
  }

  return (
    <Routes>
      <Route path='/auth' element={<Auth />} />
      
      <Route element={<Protected />}>
        <Route path='/' element={<Index />} />
      </Route>
    </Routes>
  )
}

export default App