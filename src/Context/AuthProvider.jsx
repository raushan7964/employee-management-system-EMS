import React, { useEffect } from 'react'
import { createContext, useState } from 'react'
import { getLocalStorage, setLocalStorage } from '../utils/localStorage'
import { initializeSampleEmployees, getEmployees } from '../utils/employeeStorage'
import { initializeSampleTasks } from '../utils/taskStorage'
import { initializeSampleAdmins, getAdmins } from '../utils/adminStorage'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)
  
  useEffect(() => {
    // Initialize sample data safely (only if empty)
    initializeSampleTasks()
    initializeSampleEmployees()
    initializeSampleAdmins()
    
    // Read stored data
    const employees = getEmployees()
    const admin = getAdmins()
    
    setUserData({ employees, admin })
  }, [])

  return (
    <div>
      <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
    </div>
  )
}

export default AuthProvider
