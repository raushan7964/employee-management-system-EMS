import React, { useEffect } from 'react'
import { createContext, useState } from 'react'
import { getLocalStorage, setLocalStorage } from '../utils/localStorage'
import { initializeSampleEmployees, getEmployees } from '../utils/employeeStorage'
import { initializeSampleTasks } from '../utils/taskStorage'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)
  
  useEffect(() => {
    // Initialize sample data if needed
    initializeSampleTasks()
    initializeSampleEmployees()
    
    // Read stored employees and admin entries
    setLocalStorage()
    const employees = getEmployees() // Use storage utility instead
    const admin = getLocalStorage('admin')
    
    setUserData({ employees, admin })
    console.log('Initialized data:', { employeeCount: employees.length, admin })
  }, [])

  return (
    <div>
      <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
    </div>
  )
}

export default AuthProvider
