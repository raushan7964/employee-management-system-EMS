import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTasks } from '../utils/taskStorage'

const TaskList = ({ employee }) => {
  const navigate = useNavigate()
  const [recentTasks, setRecentTasks] = useState([])

  useEffect(() => {
    loadRecentTasks()
  }, [])

  const loadRecentTasks = async () => {
    const allTasks = await getTasks()
    // Get last 6 tasks, sorted by creation date
    const recent = allTasks
      .filter(task => task.approval_status !== 'pending') // Exclude pending approval tasks
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 6)
    setRecentTasks(recent)
  }

  const getStatusColor = (status) => {
    const colors = {
      'new': 'bg-blue-50 text-blue-700 border-blue-200',
      'in-progress': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'completed': 'bg-green-50 text-green-700 border-green-200',
      'failed': 'bg-red-50 text-red-700 border-red-200',
      'pending-approval': 'bg-orange-50 text-orange-700 border-orange-200',
    }
    return colors[status] || 'bg-slate-50 text-slate-700'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'text-slate-600',
      'medium': 'text-blue-600',
      'high': 'text-orange-600',
      'urgent': 'text-red-600',
    }
    return colors[priority] || 'text-slate-600'
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Recent Tasks</h3>
        <button
          onClick={() => navigate('/tasks')}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          View All →
        </button>
      </div>

      {recentTasks.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <div className="text-6xl mb-4">📋</div>
          <div className="text-lg font-semibold text-slate-800 mb-2">No Tasks Yet</div>
          <div className="text-sm">Create your first task to get started</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => navigate(`/tasks/${task.id}`)}
              className="p-4 border-2 border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-slate-800 flex-1 line-clamp-1">{task.title}</h4>
                <span className={`ml-2 text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold border-2 ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  <div>{task.assignee_name || task.assigneeName}</div>
                  <div>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default TaskList
