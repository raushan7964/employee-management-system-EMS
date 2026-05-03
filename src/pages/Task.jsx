import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthProvider'
import { addTask } from '../utils/taskStorage'
import { getEmployees } from '../utils/employeeStorage'
import Toast from '../components/common/Toast'

const Task = ({ userRole, currentEmployee }) => {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    assigneeName: '',
    priority: 'medium',
    dueDate: '',
    category: 'development',
  })

  const [toast, setToast] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadEmployees = async () => {
    const allEmployees = await getEmployees()
    setEmployees(allEmployees)
  }

  // Load employees on mount and refresh
  useEffect(() => {
    loadEmployees()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Find assignee name
    let taskData
    
    if (userRole === 'employee' && currentEmployee) {
      // Employee creating task for themselves
      taskData = {
        ...formData,
        assignee: currentEmployee.email,
        assigneeName: `${currentEmployee.first_name} ${currentEmployee.last_name || ''}`,
        createdBy: currentEmployee.email,
        status: 'pending-approval', // Requires admin approval
        approvalStatus: 'pending',
      }
    } else {
      // Admin creating task
      const selectedEmployee = employees.find(emp => emp.email === formData.assignee)
      taskData = {
        ...formData,
        assigneeName: selectedEmployee ? `${selectedEmployee.first_name} ${selectedEmployee.last_name || ''}` : '',
        createdBy: 'admin@example.com',
        approvalStatus: 'approved', // Admin tasks are auto-approved
      }
    }

    // Add task to Supabase
    const result = await addTask(taskData)

    if (result.success) {
      const message = userRole === 'employee' 
        ? 'Task created! Waiting for admin approval.' 
        : 'Task created successfully!'
      setToast({ message, type: 'success' })
      setTimeout(() => {
        navigate('/tasks')
      }, 1500)
    } else {
      setToast({ message: `Error: ${result.error}`, type: 'error' })
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-6">
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors"
        >
          <span>←</span>
          <span>Back to Tasks</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100">
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {userRole === 'employee' ? 'Create Self-Task' : 'Create New Task'}
        </h1>
        <p className="text-slate-600">
          {userRole === 'employee' 
            ? 'Create a task for yourself. It will be sent to admin for approval.' 
            : 'Fill in the details below to create and assign a new task'}
        </p>
      </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe the task in detail"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assignee - Admin Only */}
            {userRole === 'admin' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Assign To *
                </label>
                <select
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white transition-all"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.email}>
                      {emp.first_name} {emp.last_name || ''} - {emp.role}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Employee Info - For Employee View */}
            {userRole === 'employee' && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    ℹ️
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-blue-800">Self-Assigned Task</div>
                    <div className="text-xs text-blue-600">This task will be assigned to you and requires admin approval</div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white transition-all"
              >
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="support">Support</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              disabled={isSubmitting}
              className="px-8 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Task
