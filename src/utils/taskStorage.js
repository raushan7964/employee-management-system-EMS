// Task Storage Utilities - Centralized task management with localStorage

const TASKS_KEY = 'employeeMS_tasks'

// Generate unique ID for tasks
const generateTaskId = () => {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Migrate old tasks to add missing approvalStatus field
const migrateTasks = (tasks) => {
  let needsMigration = false
  
  const migratedTasks = tasks.map(task => {
    // If task has pending-approval status but no approvalStatus field, add it
    if (task.status === 'pending-approval' && !task.approvalStatus) {
      needsMigration = true
      return {
        ...task,
        approvalStatus: 'pending'
      }
    }
    // If task doesn't have approvalStatus, set it based on status
    if (!task.approvalStatus) {
      needsMigration = true
      return {
        ...task,
        approvalStatus: task.status === 'pending-approval' ? 'pending' : 'approved'
      }
    }
    return task
  })
  
  // Save migrated tasks if changes were made
  if (needsMigration) {
    console.log('Migrating tasks to add approvalStatus field...')
    localStorage.setItem(TASKS_KEY, JSON.stringify(migratedTasks))
    console.log('Migration complete!')
  }
  
  return migratedTasks
}

// Get all tasks from localStorage
export const getTasks = () => {
  try {
    const tasks = localStorage.getItem(TASKS_KEY)
    const parsedTasks = tasks ? JSON.parse(tasks) : []
    // Run migration to fix old tasks
    return migrateTasks(parsedTasks)
  } catch (error) {
    console.error('Error loading tasks:', error)
    return []
  }
}

// Get single task by ID
export const getTaskById = (id) => {
  const tasks = getTasks()
  return tasks.find(task => task.id === id)
}

// Add new task
export const addTask = (taskData) => {
  try {
    const tasks = getTasks()
    const newTask = {
      id: generateTaskId(),
      ...taskData,
      status: taskData.status || 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    tasks.push(newTask)
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    return { success: true, task: newTask }
  } catch (error) {
    console.error('Error adding task:', error)
    return { success: false, error: error.message }
  }
}

// Update existing task
export const updateTask = (id, updates) => {
  try {
    const tasks = getTasks()
    const index = tasks.findIndex(task => task.id === id)
    
    if (index === -1) {
      return { success: false, error: 'Task not found' }
    }
    
    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    return { success: true, task: tasks[index] }
  } catch (error) {
    console.error('Error updating task:', error)
    return { success: false, error: error.message }
  }
}

// Update task status
export const updateTaskStatus = (id, status) => {
  return updateTask(id, { status })
}

// Delete task
export const deleteTask = (id) => {
  try {
    const tasks = getTasks()
    const filteredTasks = tasks.filter(task => task.id !== id)
    
    if (tasks.length === filteredTasks.length) {
      return { success: false, error: 'Task not found' }
    }
    
    localStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks))
    return { success: true }
  } catch (error) {
    console.error('Error deleting task:', error)
    return { success: false, error: error.message }
  }
}

// Get tasks by status
export const getTasksByStatus = (status) => {
  const tasks = getTasks()
  return tasks.filter(task => task.status === status)
}

// Get tasks by assignee
export const getTasksByAssignee = (email) => {
  const tasks = getTasks()
  return tasks.filter(task => task.assignee === email)
}

// Get task statistics
export const getTaskStats = () => {
  const tasks = getTasks()
  return {
    total: tasks.length,
    new: tasks.filter(t => t.status === 'new').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  }
}

// Initialize with sample tasks if empty
export const initializeSampleTasks = () => {
  const tasks = getTasks()
  if (tasks.length === 0) {
    const sampleTasks = [
      {
        id: generateTaskId(),
        title: 'Design new landing page',
        description: 'Create a modern, responsive landing page with hero section, features, and testimonials',
        assignee: 'employee1@company.com',
        assigneeName: 'Aarav Sharma',
        priority: 'high',
        status: 'in-progress',
        category: 'design',
        dueDate: '2025-12-30',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin@example.com',
      },
      {
        id: generateTaskId(),
        title: 'Implement user authentication',
        description: 'Add JWT-based authentication with login, signup, and password reset functionality',
        assignee: 'employee2@company.com',
        assigneeName: 'Priya Patel',
        priority: 'urgent',
        status: 'in-progress',
        category: 'development',
        dueDate: '2025-12-28',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin@example.com',
      },
      {
        id: generateTaskId(),
        title: 'Write API documentation',
        description: 'Document all REST API endpoints with examples and response formats',
        assignee: 'employee3@company.com',
        assigneeName: 'Rohan Kumar',
        priority: 'medium',
        status: 'completed',
        category: 'development',
        dueDate: '2025-12-25',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'admin@example.com',
      },
      {
        id: generateTaskId(),
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        assignee: 'employee1@company.com',
        assigneeName: 'Aarav Sharma',
        priority: 'high',
        status: 'new',
        category: 'development',
        dueDate: '2026-01-05',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'admin@example.com',
      },
      {
        id: generateTaskId(),
        title: 'Create marketing materials',
        description: 'Design social media graphics and email templates for product launch',
        assignee: 'employee4@company.com',
        assigneeName: 'Ananya Singh',
        priority: 'medium',
        status: 'new',
        category: 'marketing',
        dueDate: '2026-01-10',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin@example.com',
      },
    ]
    
    localStorage.setItem(TASKS_KEY, JSON.stringify(sampleTasks))
    return sampleTasks
  }
  return tasks
}
