// Admin Storage Utilities

const ADMIN_KEY = 'admin' // Keeping 'admin' key for compatibility with existing code

// Get all admins
export const getAdmins = () => {
  try {
    const admins = localStorage.getItem(ADMIN_KEY)
    return admins ? JSON.parse(admins) : []
  } catch (error) {
    console.error('Error loading admins:', error)
    return []
  }
}

// Add new admin
export const addAdmin = (adminData) => {
  try {
    const admins = getAdmins()
    
    // Check duplicate
    if (admins.some(a => a.email === adminData.email)) {
      return { success: false, error: 'Email already exists' }
    }

    const newAdmin = {
      id: Date.now(),
      ...adminData,
      role: 'admin'
    }

    admins.push(newAdmin)
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admins))
    
    return { success: true, admin: newAdmin }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Initialize sample admin if none exist
export const initializeSampleAdmins = () => {
  const admins = getAdmins()
  if (admins.length === 0) {
    const sampleAdmins = [
      {
        id: 1,
        firstName: 'Ankit',
        email: 'admin@me.com',
        password: '123',
        role: 'admin'
      }
    ]
    localStorage.setItem(ADMIN_KEY, JSON.stringify(sampleAdmins))
    return sampleAdmins
  }
  return admins
}
