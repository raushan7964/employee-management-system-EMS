import { getEmployees, addEmployee } from './employeeStorage'
import { getTasks, addTask } from './taskStorage'
import { getAdmins, addAdmin } from './adminStorage'

export const seedInitialData = async () => {
  if (localStorage.getItem('isSeeded')) return 

  console.log('Seeding initial data for offline mode...')
  localStorage.setItem('isSeeded', 'true')

  // 1. Seed Admins
  await addAdmin({
    firstName: 'Admin',
    email: 'admin@me.com',
    password: '123'
  })

  // 2. Seed Employees
  const demoEmployees = [
    { firstName: 'Raushan', lastName: 'Kumar', email: 'raushan@me.com', password: '123', department: 'Engineering', role: 'Senior Developer' },
    { firstName: 'Neha', lastName: 'Sharma', email: 'neha@me.com', password: '123', department: 'Design', role: 'UI Designer' },
    { firstName: 'Amit', lastName: 'Singh', email: 'amit@me.com', password: '123', department: 'Marketing', role: 'Manager' },
    { firstName: 'Priya', lastName: 'Verma', email: 'priya@me.com', password: '123', department: 'Sales', role: 'Executive' },
    { firstName: 'Suresh', lastName: 'Raina', email: 'suresh@me.com', password: '123', department: 'Support', role: 'Assistant' },
  ]

  for (const emp of demoEmployees) {
    await addEmployee(emp)
  }

  // 3. Seed Tasks (2 for each employee)
  const tasks = [
    { title: 'Fix Login Bug', description: 'Resolve the timeout issue on login page', assignee: 'raushan@me.com', assigneeName: 'Raushan Kumar', priority: 'high', status: 'new', dueDate: '2026-02-01' },
    { title: 'Database Migration', description: 'Move legacy data to new schema', assignee: 'raushan@me.com', assigneeName: 'Raushan Kumar', priority: 'urgent', status: 'in-progress', dueDate: '2026-02-05' },
    
    { title: 'Redesign Header', description: 'Create a modern mobile responsive header', assignee: 'neha@me.com', assigneeName: 'Neha Sharma', priority: 'medium', status: 'new', dueDate: '2026-02-10' },
    { title: 'Logo Concepts', description: 'Design 3 new logo options', assignee: 'neha@me.com', assigneeName: 'Neha Sharma', priority: 'low', status: 'completed', dueDate: '2026-01-20' },
    
    { title: 'Q1 Campaign', description: 'Plan the social media strategy for Q1', assignee: 'amit@me.com', assigneeName: 'Amit Singh', priority: 'high', status: 'in-progress', dueDate: '2026-02-15' },
    { title: 'Market Research', description: 'Analyze competitor pricing models', assignee: 'amit@me.com', assigneeName: 'Amit Singh', priority: 'medium', status: 'new', dueDate: '2026-02-20' },
    
    { title: 'Sales Pitch', description: 'Prepare slides for the big client meeting', assignee: 'priya@me.com', assigneeName: 'Priya Verma', priority: 'urgent', status: 'new', dueDate: '2026-02-05' },
    { title: 'Lead Follow-up', description: 'Contact the leads from last week conference', assignee: 'priya@me.com', assigneeName: 'Priya Verma', priority: 'medium', status: 'in-progress', dueDate: '2026-02-08' },
    
    { title: 'Customer Support', description: 'Clear the pending tickets in ZenDesk', assignee: 'suresh@me.com', assigneeName: 'Suresh Raina', priority: 'low', status: 'new', dueDate: '2026-02-02' },
    { title: 'Feedback Survey', description: 'Create a Google Form for user feedback', assignee: 'suresh@me.com', assigneeName: 'Suresh Raina', priority: 'medium', status: 'pending-approval', dueDate: '2026-02-12' },
  ]

  for (const task of tasks) {
    await addTask(task)
  }

  console.log('Seed completed successfully.')
}
