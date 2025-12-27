import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTasks } from '../utils/taskStorage'

const AllTasks = ({ userRole, currentEmployee }) => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadTasks()
  }, [currentEmployee, userRole])

  const loadTasks = () => {
    let allTasks = getTasks()
    
    // If employee, show only their tasks
    if (userRole === 'employee' && currentEmployee?.email) {
      allTasks = allTasks.filter(task => task.assignee === currentEmployee.email)
    }
    
    setTasks(allTasks)
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    const colors = {
      'new': 'bg-blue-50 text-blue-700 border-blue-200',
      'in-progress': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'completed': 'bg-green-50 text-green-700 border-green-200',
      'failed': 'bg-red-50 text-red-700 border-red-200',
    }
    return colors[status] || 'bg-slate-50 text-slate-700'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-slate-100 text-slate-600',
      'medium': 'bg-blue-100 text-blue-600',
      'high': 'bg-orange-100 text-orange-600',
      'urgent': 'bg-red-100 text-red-600',
    }
    return colors[priority] || 'bg-slate-100 text-slate-600'
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {userRole === 'employee' ? 'My Tasks' : 'All Tasks'}
            </h1>
            <p className="text-slate-600">
              {userRole === 'employee' 
                ? `Your assigned tasks (${filteredTasks.length} tasks)` 
                : `Manage and track all tasks across the organization (${filteredTasks.length} tasks)`}
            </p>
          </div>
          {userRole === 'admin' && (
            <button
              onClick={() => navigate('/task')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>+</span>
              <span>New Task</span>
            </button>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full px-4 py-3 pl-12 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white font-medium text-slate-700"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No tasks found</h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Create your first task to get started'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => navigate('/task')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Create First Task
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => navigate(`/tasks/${task.id}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 border border-slate-100 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-slate-800 flex-1 line-clamp-2">{task.title}</h3>
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{task.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Assignee:</span>
                  <span className="font-medium text-slate-700">{task.assigneeName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Due:</span>
                  <span className="font-medium text-slate-700">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold border-2 ${getStatusColor(task.status)}`}>
                  {task.status.replace('-', ' ').toUpperCase()}
                </span>
                <span className="text-indigo-600 font-semibold text-sm hover:text-indigo-700">
                  View Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllTasks
