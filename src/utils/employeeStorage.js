import { supabase, isConfigured } from './supabase'

const LS_KEY = 'employees'

// Helper to normalize employee data between Supabase and LocalStorage
const normalizeEmployee = (emp) => {
  if (!emp) return null
  return {
    ...emp,
    firstName: emp.first_name || emp.firstName,
    lastName: emp.last_name || emp.lastName,
    first_name: emp.first_name || emp.firstName,
    last_name: emp.last_name || emp.lastName,
  }
}

// Get all employees
export const getEmployees = async () => {
  try {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
      
      if (error) throw error
      return (data || []).map(normalizeEmployee)
    } else {
      const data = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      return data.map(normalizeEmployee)
    }
  } catch (error) {
    console.error('Error loading employees:', error)
    return []
  }
}

// Get single employee by ID
export const getEmployeeById = async (id) => {
  try {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return normalizeEmployee(data)
    } else {
      const employees = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      return normalizeEmployee(employees.find(e => e.id == id))
    }
  } catch (error) {
    console.error('Error loading employee by ID:', error)
    return null
  }
}

// Get employee by email
export const getEmployeeByEmail = async (email) => {
  try {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error) throw error
      return normalizeEmployee(data)
    } else {
      const employees = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      return normalizeEmployee(employees.find(e => e.email === email))
    }
  } catch (error) {
    console.error('Error loading employee by email:', error)
    return null
  }
}

// Add new employee
export const addEmployee = async (employeeData) => {
  try {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('employees')
        .insert([
          {
            first_name: employeeData.firstName || employeeData.first_name,
            last_name: employeeData.lastName || employeeData.last_name,
            email: employeeData.email,
            password: employeeData.password,
            department: employeeData.department,
            role: employeeData.role,
            avatar: employeeData.avatar
          }
        ])
        .select()
      
      if (error) {
        if (error.code === '23505') return { success: false, error: 'Email already exists' }
        throw error
      }
      
      return { success: true, employee: normalizeEmployee(data[0]) }
    } else {
      const employees = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      if (employees.some(e => e.email === employeeData.email)) {
        return { success: false, error: 'Email already exists' }
      }
      
      const newEmployee = {
        ...employeeData,
        id: Date.now(),
        firstName: employeeData.firstName || employeeData.first_name,
        lastName: employeeData.lastName || employeeData.last_name,
      }
      employees.push(newEmployee)
      localStorage.setItem(LS_KEY, JSON.stringify(employees))
      return { success: true, employee: normalizeEmployee(newEmployee) }
    }
  } catch (error) {
    console.error('Error adding employee:', error)
    return { success: false, error: error.message }
  }
}

// Update existing employee
export const updateEmployee = async (id, updates) => {
  try {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('employees')
        .update({
          first_name: updates.firstName || updates.first_name,
          last_name: updates.lastName || updates.last_name,
          email: updates.email,
          password: updates.password,
          department: updates.department,
          role: updates.role,
          avatar: updates.avatar,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      
      if (error) {
        if (error.code === '23505') return { success: false, error: 'Email already exists' }
        throw error
      }
      
      return { success: true, employee: normalizeEmployee(data[0]) }
    } else {
      let employees = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      const index = employees.findIndex(e => e.id == id)
      if (index === -1) return { success: false, error: 'Employee not found' }
      
      employees[index] = { 
        ...employees[index], 
        ...updates,
        firstName: updates.firstName || updates.first_name || employees[index].firstName,
        lastName: updates.lastName || updates.last_name || employees[index].lastName,
      }
      localStorage.setItem(LS_KEY, JSON.stringify(employees))
      return { success: true, employee: normalizeEmployee(employees[index]) }
    }
  } catch (error) {
    console.error('Error updating employee:', error)
    return { success: false, error: error.message }
  }
}

// Delete employee
export const deleteEmployee = async (id) => {
  try {
    if (isConfigured) {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    } else {
      let employees = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      employees = employees.filter(e => e.id != id)
      localStorage.setItem(LS_KEY, JSON.stringify(employees))
      return { success: true }
    }
  } catch (error) {
    console.error('Error deleting employee:', error)
    return { success: false, error: error.message }
  }
}

// Get employee statistics
export const getEmployeeStats = async () => {
  try {
    const employees = await getEmployees()
    
    return {
      total: employees.length,
      byDepartment: employees.reduce((acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1
        return acc
      }, {}),
    }
  } catch (error) {
    console.error('Error getting employee stats:', error)
    return { total: 0, byDepartment: {} }
  }
}
