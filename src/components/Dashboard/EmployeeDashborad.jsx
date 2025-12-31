import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTasks } from '../../utils/taskStorage'
import { FaClipboardList, FaBolt, FaCheckCircle, FaHourglassHalf, FaClock, FaPlus, FaChartBar, FaCog, FaSmile } from 'react-icons/fa'

const EmployeeDashboard = ({ employee }) => {
  const navigate = useNavigate()
  const [myTasks, setMyTasks] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [stats, setStats] = useState({ total: 0, new: 0, inProgress: 0, completed: 0, failed: 0 })

  useEffect(() => {
    if (employee?.email) {
      loadMyTasks()
    }
  }, [employee])

  const loadMyTasks = () => {
    const allTasks = getTasks()
    const employeeTasks = allTasks.filter(task => task.assignee === employee.email)
    setMyTasks(employeeTasks)

    // Calculate stats
    setStats({
      total: employeeTasks.length,
      new: employeeTasks.filter(t => t.status === 'new').length,
      inProgress: employeeTasks.filter(t => t.status === 'in-progress').length,
      completed: employeeTasks.filter(t => t.status === 'completed').length,
      failed: employeeTasks.filter(t => t.status === 'failed').length,
    })
  }

  const name = `${employee?.firstName || ''} ${employee?.lastName || ''}`.trim() || 'Employee'
  const email = employee?.email || ''
  const role = employee?.role || 'Employee'
  const department = employee?.department || 'General'

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
      'low': 'text-slate-600',
      'medium': 'text-blue-600',
      'high': 'text-orange-600',
      'urgent': 'text-red-600',
    }
    return colors[priority] || 'text-slate-600'
  }

  const completionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(0) : 0
  const pendingApproval = myTasks.filter(t => t.approvalStatus === 'pending').length

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome back, {employee?.firstName || 'Employee'}! <FaSmile className="inline text-yellow-500" />
            </h1>
            <p className="text-slate-600">Here's an overview of your tasks and progress</p>
          </div>
          <button
            onClick={() => navigate('/task')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <FaPlus />
            <span>Create Self-Task</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border-2 border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-blue-700">Total Tasks</div>
            <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg">
              <FaClipboardList />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
          <div className="text-xs text-slate-600 mt-1">Assigned to you</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-md p-6 border-2 border-yellow-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-yellow-700">In Progress</div>
            <div className="h-10 w-10 rounded-full bg-yellow-500 text-white flex items-center justify-center text-lg">
              <FaBolt />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">{stats.inProgress}</div>
          <div className="text-xs text-slate-600 mt-1">Active tasks</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-6 border-2 border-green-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-green-700">Completed</div>
            <div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center text-lg">
              <FaCheckCircle />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">{stats.completed}</div>
          <div className="text-xs text-green-600 mt-1">{completionRate}% success rate</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6 border-2 border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-purple-700">Pending</div>
            <div className="h-10 w-10 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg">
              <FaHourglassHalf />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">{stats.new}</div>
          <div className="text-xs text-slate-600 mt-1">Not started</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-md p-6 border-2 border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-orange-700">Awaiting Approval</div>
            <div className="h-10 w-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-lg">
              <FaClock />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">{pendingApproval}</div>
          <div className="text-xs text-slate-600 mt-1">Pending admin review</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Tasks List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">My Tasks</h3>
              <div className="flex items-center gap-3">
                <select 
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="in-progress">Active</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
                <button
                  onClick={() => navigate('/tasks')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  View All →
                </button>
              </div>
            </div>

            {myTasks.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FaCheckCircle className="text-6xl mb-4 text-green-500 mx-auto" />
                <div className="text-lg font-semibold text-slate-800 mb-2">All caught up!</div>
                <div className="text-sm">No tasks assigned to you at the moment</div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {myTasks
                  .filter(t => filterStatus === 'all' || t.status === filterStatus)
                  .slice(0, 10)
                  .map((task) => (
                  <div
                    key={task.id}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-800 flex-1">{task.title}</h4>
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border-2 ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </span>
                        {task.approvalStatus === 'pending' && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-semibold">
                            <FaClock className="inline mr-1" /> Pending Approval
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Profile & Progress */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg mb-4">
                {employee?.firstName?.charAt(0) || 'E'}
              </div>
              <h3 className="text-lg font-bold text-slate-800">{name}</h3>
              <p className="text-sm text-indigo-600 font-medium">{role}</p>
              <p className="text-xs text-slate-500 mt-1">{department}</p>
              <p className="text-xs text-slate-600 mt-2 break-words">{email}</p>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 mb-4">Task Progress</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Completion Rate</span>
                  <span className="font-bold text-green-600">{completionRate}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
                    <div className="text-xs text-slate-600 mt-1">New</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
                    <div className="text-xs text-slate-600 mt-1">Active</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                    <div className="text-xs text-slate-600 mt-1">Done</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                    <div className="text-xs text-slate-600 mt-1">Failed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/task')}
                className="w-full px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold transition-colors text-left"
              >
                <span className="mr-2"><FaPlus className="inline" /></span> Create Self-Task
              </button>
              <button
                onClick={() => navigate('/tasks')}
                className="w-full px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold transition-colors text-left"
              >
                <span className="mr-2"><FaClipboardList className="inline" /></span> View All My Tasks
              </button>
              <button
                onClick={() => navigate('/reports')}
                className="w-full px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-semibold transition-colors text-left"
              >
                <span className="mr-2"><FaChartBar className="inline" /></span> My Performance Report
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="w-full px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold transition-colors text-left"
              >
                <span className="mr-2"><FaCog className="inline" /></span> Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard
