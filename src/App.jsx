import { useState, useEffect, useContext } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import AppRoutes from './Routes/Route'
import { AuthContext } from './Context/AuthProvider.jsx'
import { getEmployees } from './utils/employeeStorage'
import { getAdmins } from './utils/adminStorage'

function App() {
  const [user, setUser] = useState(null) // 'admin' | 'employee' | null
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const authData = useContext(AuthContext)

  useEffect(() => {
    // Only check localStorage on initial load, independent of AuthContext for user session
    const raw = localStorage.getItem('loggedInUser')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        // Verify user still exists in storage (in case deleted)
        if (parsed.role === 'employee' && parsed.employee) {
          const freshData = getEmployees().find(e => e.email === parsed.employee.email)
          if (freshData) {
            setUser('employee')
            setCurrentEmployee(freshData) // Use fresh data
          } else {
            localStorage.removeItem('loggedInUser')
          }
        } else if (parsed.role === 'admin') {
          setUser('admin')
        }
      } catch (e) {
        localStorage.removeItem('loggedInUser')
      }
    }
  }, [authData])

  const handleLogin = (email, password) => {
    // Read directly from storage to ensure we have simplest source of truth
    const admins = getAdmins()
    const employees = getEmployees()

    // 1. Admin check
    const adminMatch = admins.find((a) => email === a.email && password === a.password)
    
    if (adminMatch) {
      setUser('admin')
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin' }))
      return
    }

    // 2. Employee check
    const employeeMatch = employees.find((e) => email === e.email && password === e.password)

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
  
  const toggleView = () => setIsRegistering(!isRegistering)

  return (
    <BrowserRouter>
      {!user ? (
        isRegistering ? (
          <Register 
            onRegisterSuccess={() => setIsRegistering(false)} 
            toggleView={toggleView} 
          />
        ) : (
          <Login 
            handleLogin={handleLogin} 
            toggleView={toggleView} 
          />
        )
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
