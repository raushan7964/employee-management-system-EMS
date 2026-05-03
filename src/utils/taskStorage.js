import { supabase, isConfigured } from './supabase'

const LS_KEY = 'employeeMS_tasks'

// Helper to normalize task data between Supabase and LocalStorage
const normalizeTask = (task) => {
  if (!task) return null
  return {
    ...task,
    dueDate: task.due_date || task.dueDate,
    due_date: task.due_date || task.dueDate,
    assigneeName: task.assignee_name || task.assigneeName,
    assignee_name: task.assignee_name || task.assigneeName,
    assignee_email: task.assignee_email || task.assigneeEmail || task.assignee,
    approvalStatus: task.approval_status || task.approvalStatus,
    approval_status: task.approval_status || task.approvalStatus,
  }
}

// Get all tasks
export const getTasks = async () => {
  try {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
      
      if (error) throw error
      return (data || []).map(normalizeTask)
    } else {
      const data = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      return data.map(normalizeTask)
    }
  } catch (error) {
    console.error('Error loading tasks:', error)
    return []
  }
}

// Get single task by ID
export const getTaskById = async (id) => {
  try {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return normalizeTask(data)
    } else {
      const tasks = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      return normalizeTask(tasks.find(t => t.id == id))
    }
  } catch (error) {
    console.error('Error loading task by ID:', error)
    return null
  }
}

// Add new task
export const addTask = async (taskData) => {
  try {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: taskData.title,
            description: taskData.description,
            assignee_email: taskData.assignee || taskData.assignee_email,
            assignee_name: taskData.assigneeName || taskData.assignee_name,
            priority: taskData.priority,
            status: taskData.status || 'new',
            category: taskData.category,
            due_date: taskData.dueDate || taskData.due_date,
            approval_status: taskData.approvalStatus || 'approved',
            created_by: taskData.createdBy || taskData.created_by
          }
        ])
        .select()
      
      if (error) throw error
      return { success: true, task: normalizeTask(data[0]) }
    } else {
      const tasks = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      const newTask = {
        ...taskData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: taskData.status || 'new',
        approvalStatus: taskData.approvalStatus || 'approved'
      }
      tasks.push(newTask)
      localStorage.setItem(LS_KEY, JSON.stringify(tasks))
      return { success: true, task: normalizeTask(newTask) }
    }
  } catch (error) {
    console.error('Error adding task:', error)
    return { success: false, error: error.message }
  }
}

// Update existing task
export const updateTask = async (id, updates) => {
  try {
    if (isConfigured) {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      
      if (error) throw error
      return { success: true, task: normalizeTask(data[0]) }
    } else {
      let tasks = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      const index = tasks.findIndex(t => t.id == id)
      if (index === -1) return { success: false, error: 'Task not found' }
      
      tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() }
      localStorage.setItem(LS_KEY, JSON.stringify(tasks))
      return { success: true, task: normalizeTask(tasks[index]) }
    }
  } catch (error) {
    console.error('Error updating task:', error)
    return { success: false, error: error.message }
  }
}

// Update task status
export const updateTaskStatus = async (id, status) => {
  return await updateTask(id, { status })
}

// Delete task
export const deleteTask = async (id) => {
  try {
    if (isConfigured) {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    } else {
      let tasks = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
      tasks = tasks.filter(t => t.id != id)
      localStorage.setItem(LS_KEY, JSON.stringify(tasks))
      return { success: true }
    }
  } catch (error) {
    console.error('Error deleting task:', error)
    return { success: false, error: error.message }
  }
}

// Get tasks by status
export const getTasksByStatus = async (status) => {
  const allTasks = await getTasks()
  return allTasks.filter(t => t.status === status)
}

// Get tasks by assignee
export const getTasksByAssignee = async (email) => {
  const allTasks = await getTasks()
  return allTasks.filter(task => (task.assignee_email || task.assignee) === email)
}

// Get task statistics
export const getTaskStats = async () => {
  try {
    const tasks = await getTasks()
    
    return {
      total: tasks.length,
      new: tasks.filter(t => t.status === 'new').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      failed: tasks.filter(t => t.status === 'failed').length,
    }
  } catch (error) {
    console.error('Error getting task stats:', error)
    return { total: 0, new: 0, inProgress: 0, completed: 0, failed: 0 }
  }
}
