import React, { useEffect } from 'react'
import { createContext, useState } from 'react'
import { getEmployees } from '../utils/employeeStorage'
import { getAdmins } from '../utils/adminStorage'
import { isConfigured } from '../utils/supabase'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Seed data if offline and empty
        if (!isConfigured) {
          const { seedInitialData } = await import('../utils/seedData')
          await seedInitialData()
        }

        const [employees, admin] = await Promise.all([
          getEmployees(),
          getAdmins()
        ])
        
        setUserData({ employees, admin })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    
    fetchData()
  }, [])

  return (
    <AuthContext.Provider value={userData}>
      {!isConfigured && (
        <div className="fixed bottom-4 right-4 z-[9999] animate-bounce">
          <div className="bg-amber-100 border-2 border-amber-500 text-amber-800 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm">
            <span className="flex h-3 w-3 rounded-full bg-amber-500"></span>
            Offline Mode (No Supabase)
          </div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
