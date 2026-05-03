import { supabase } from './supabase'
import { addEmployee } from './employeeStorage'
import { addAdmin } from './adminStorage'
import { addTask } from './taskStorage'

export const migrateLegacyData = async () => {
  const results = {
    employees: 0,
    admins: 0,
    tasks: 0,
    errors: []
  }

  try {
    // 1. Migrate Admins
    const legacyAdmins = JSON.parse(localStorage.getItem('admin') || '[]')
    for (const admin of legacyAdmins) {
      const res = await addAdmin(admin)
      if (res.success) results.admins++
      else results.errors.push(`Admin ${admin.email}: ${res.error}`)
    }

    // 2. Migrate Employees
    const legacyEmployees = JSON.parse(localStorage.getItem('employees') || localStorage.getItem('employeeMS_employees') || '[]')
    for (const emp of legacyEmployees) {
      const res = await addEmployee(emp)
      if (res.success) results.employees++
      else results.errors.push(`Employee ${emp.email}: ${res.error}`)
    }

    // 3. Migrate Tasks
    const legacyTasks = JSON.parse(localStorage.getItem('employeeMS_tasks') || '[]')
    for (const task of legacyTasks) {
      const res = await addTask(task)
      if (res.success) results.tasks++
      else results.errors.push(`Task ${task.title}: ${res.error}`)
    }

    return results
  } catch (error) {
    console.error('Migration failed:', error)
    return { ...results, fatalError: error.message }
  }
}

export const hasLegacyData = () => {
  return !!(
    localStorage.getItem('employees') || 
    localStorage.getItem('admin') || 
    localStorage.getItem('employeeMS_tasks')
  )
}
