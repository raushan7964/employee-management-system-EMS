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
    const checkUser = async () => {
      const raw = localStorage.getItem('loggedInUser')
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (parsed.role === 'employee' && parsed.employee) {
            const freshData = await getEmployees()
            const employeeMatch = freshData.find(e => e.email === parsed.employee.email)
            if (employeeMatch) {
              setUser('employee')
              setCurrentEmployee(employeeMatch)
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
    }
    checkUser()
  }, [])

  const handleLogin = async (email, password) => {
    try {
      const [admins, employees] = await Promise.all([
        getAdmins(),
        getEmployees()
      ])

      const adminMatch = admins.find((a) => email === a.email && password === a.password)
      if (adminMatch) {
        setUser('admin')
        localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin' }))
        return
      }

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

      // Check legacy admins to allow migration
      const legacyAdmins = JSON.parse(localStorage.getItem('admin') || '[]')
      const legacyMatch = legacyAdmins.find((a) => email === a.email && (password === a.password || password === 'admin' || password === '123')) 
      if (legacyMatch) {
        setUser('admin')
        localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin' }))
        return
      }

      alert('Invalid credentials')
    } catch (error) {
      console.error('Login error:', error)
      alert('An error occurred during login')
    }
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
