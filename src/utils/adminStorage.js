import { supabase, isConfigured } from './supabase'

const LS_KEY = 'admin'

// Helper to normalize admin data
const normalizeAdmin = (admin) => {
  if (!admin) return null
  return {
    ...admin,
    firstName: admin.first_name || admin.firstName,
    first_name: admin.first_name || admin.firstName,
  }
}

// Get all admins
export const getAdmins = async () => {
  try {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
      
      if (error) throw error
      return (data || []).map(normalizeAdmin)
    } else {
      const data = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      return data.map(normalizeAdmin)
    }
  } catch (error) {
    console.error('Error loading admins:', error)
    return []
  }
}

// Add new admin
export const addAdmin = async (adminData) => {
  try {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('admins')
        .insert([
          {
            first_name: adminData.firstName || adminData.first_name,
            email: adminData.email,
            password: adminData.password,
            role: 'admin',
            avatar: adminData.avatar
          }
        ])
        .select()
      
      if (error) {
        if (error.code === '23505') return { success: false, error: 'Email already exists' }
        throw error
      }
      
      return { success: true, admin: normalizeAdmin(data[0]) }
    } else {
      const admins = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      if (admins.some(a => a.email === adminData.email)) {
        return { success: false, error: 'Email already exists' }
      }
      
      const newAdmin = {
        ...adminData,
        id: Date.now(),
        firstName: adminData.firstName || adminData.first_name,
        role: 'admin'
      }
      admins.push(newAdmin)
      localStorage.setItem(LS_KEY, JSON.stringify(admins))
      return { success: true, admin: normalizeAdmin(newAdmin) }
    }
  } catch (error) {
    console.error('Error adding admin:', error)
    return { success: false, error: error.message }
  }
}
