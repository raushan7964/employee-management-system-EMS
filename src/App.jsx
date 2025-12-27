import { useState, useEffect, useContext } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Login from './components/Auth/Login'
import AppRoutes from './Routes/Route'
import { AuthContext } from './Context/AuthProvider.jsx'

function App() {
  const [user, setUser] = useState(null) // 'admin' | 'employee' | null
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const authData = useContext(AuthContext)

  useEffect(() => {
    if (authData) {
      const raw = localStorage.getItem('loggedInUser')
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          setUser(parsed.role || null)
          if (parsed.employee) setCurrentEmployee(parsed.employee)
        } catch (e) {
          // malformed localStorage value
          localStorage.removeItem('loggedInUser')
        }
      }
    }
  }, [authData])

  const handleLogin = (email, password) => {
    if (!authData) return alert('Auth data not loaded')

    // admin check
    const adminMatch = Array.isArray(authData.admin)
      ? authData.admin.find((a) => email === a.email && password === a.password)
      : null

    if (adminMatch) {
      setUser('admin')
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin' }))
      return
    }

    // employee check
    const employeeMatch = Array.isArray(authData.employees)
      ? authData.employees.find((e) => email === e.email && password === e.password)
      : null

    if (employeeMatch) {
      setUser('employee')
      setCurrentEmployee(employeeMatch)
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({ role: 'employee', employee: employeeMatch })
      )
      return
    }

    alert('Invalid credentials')
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentEmployee(null)
    localStorage.removeItem('loggedInUser')
  }

  return (
    <BrowserRouter>
      {!user ? (
        <Login handleLogin={handleLogin} />
      ) : (
        <AppRoutes 
          userRole={user} 
          currentEmployee={currentEmployee}
          onLogout={handleLogout}
        />
      )}
    </BrowserRouter>
  )
}

export default App
