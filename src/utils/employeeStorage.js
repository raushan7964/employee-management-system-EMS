// Employee Storage Utilities - Centralized employee management with localStorage

const EMPLOYEES_KEY = 'employeeMS_employees'

// Generate unique ID for employees
const generateEmployeeId = () => {
  return `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get all employees from localStorage
export const getEmployees = () => {
  try {
    const employees = localStorage.getItem(EMPLOYEES_KEY)
    return employees ? JSON.parse(employees) : []
  } catch (error) {
    console.error('Error loading employees:', error)
    return []
  }
}

// Get single employee by ID
export const getEmployeeById = (id) => {
  const employees = getEmployees()
  return employees.find(emp => emp.id === id)
}

// Get employee by email
export const getEmployeeByEmail = (email) => {
  const employees = getEmployees()
  return employees.find(emp => emp.email === email)
}

// Add new employee
export const addEmployee = (employeeData) => {
  try {
    const employees = getEmployees()
    
    // Check if email already exists
    if (employees.some(emp => emp.email === employeeData.email)) {
      return { success: false, error: 'Email already exists' }
    }
    
    const newEmployee = {
      id: generateEmployeeId(),
      ...employeeData,
      taskCount: {
        new: 0,
        active: 0,
        completed: 0,
        failed: 0,
      },
      createdAt: new Date().toISOString(),
    }
    
    employees.push(newEmployee)
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees))
    
    // Update AuthContext data
    updateAuthContextEmployees(employees)
    
    return { success: true, employee: newEmployee }
  } catch (error) {
    console.error('Error adding employee:', error)
    return { success: false, error: error.message }
  }
}

// Update existing employee
export const updateEmployee = (id, updates) => {
  try {
    const employees = getEmployees()
    const index = employees.findIndex(emp => emp.id === id)
    
    if (index === -1) {
      return { success: false, error: 'Employee not found' }
    }
    
    // If email is being updated, check for duplicates
    if (updates.email && updates.email !== employees[index].email) {
      if (employees.some(emp => emp.email === updates.email)) {
        return { success: false, error: 'Email already exists' }
      }
    }
    
    employees[index] = {
      ...employees[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees))
    
    // Update AuthContext data
    updateAuthContextEmployees(employees)
    
    return { success: true, employee: employees[index] }
  } catch (error) {
    console.error('Error updating employee:', error)
    return { success: false, error: error.message }
  }
}

// Delete employee
export const deleteEmployee = (id) => {
  try {
    const employees = getEmployees()
    const filteredEmployees = employees.filter(emp => emp.id !== id)
    
    if (employees.length === filteredEmployees.length) {
      return { success: false, error: 'Employee not found' }
    }
    
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(filteredEmployees))
    
    // Update AuthContext data
    updateAuthContextEmployees(filteredEmployees)
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting employee:', error)
    return { success: false, error: error.message }
  }
}

// Update AuthContext localStorage
const updateAuthContextEmployees = (employees) => {
  try {
    const authData = localStorage.getItem('employees')
    if (authData) {
      const data = JSON.parse(authData)
      data.employees = employees
      localStorage.setItem('employees', JSON.stringify(data))
    } else {
      localStorage.setItem('employees', JSON.stringify({ employees }))
    }
  } catch (error) {
    console.error('Error updating auth context:', error)
  }
}

// Initialize with sample employees if empty
export const initializeSampleEmployees = () => {
  const employees = getEmployees()
  if (employees.length === 0) {
    const sampleEmployees = [
      {
        id: generateEmployeeId(),
        firstName: 'Aarav',
        lastName: 'Sharma',
        email: 'employee1@company.com',
        password: '123',
        department: 'Engineering',
        role: 'Senior Developer',
        taskCount: { new: 1, active: 1, completed: 5, failed: 0 },
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateEmployeeId(),
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'employee2@company.com',
        password: '123',
        department: 'Engineering',
        role: 'Full Stack Developer',
        taskCount: { new: 0, active: 1, completed: 8, failed: 0 },
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateEmployeeId(),
        firstName: 'Rohan',
        lastName: 'Kumar',
        email: 'employee3@company.com',
        password: '123',
        department: 'Engineering',
        role: 'Backend Developer',
        taskCount: { new: 0, active: 0, completed: 12, failed: 1 },
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateEmployeeId(),
        firstName: 'Ananya',
        lastName: 'Singh',
        email: 'employee4@company.com',
        password: '123',
        department: 'Marketing',
        role: 'Marketing Manager',
        taskCount: { new: 1, active: 0, completed: 6, failed: 0 },
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateEmployeeId(),
        firstName: 'Vikram',
        lastName: 'Reddy',
        email: 'employee5@company.com',
        password: '123',
        department: 'Design',
        role: 'UI/UX Designer',
        taskCount: { new: 0, active: 0, completed: 4, failed: 0 },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
    
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(sampleEmployees))
    updateAuthContextEmployees(sampleEmployees)
    return sampleEmployees
  }
  return employees
}

// Get employee statistics
export const getEmployeeStats = () => {
  const employees = getEmployees()
  return {
    total: employees.length,
    byDepartment: employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1
      return acc
    }, {}),
  }
}
