import React, { useState, useEffect } from 'react'
import { getTasks, getTaskStats } from '../utils/taskStorage'
import { getEmployees } from '../utils/employeeStorage'
import { FaCheck, FaTrophy, FaClipboardList } from 'react-icons/fa'

const Reports = ({ userRole, currentEmployee }) => {
  const [stats, setStats] = useState({ total: 0, new: 0, inProgress: 0, completed: 0, failed: 0 })
  const [topPerformers, setTopPerformers] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [dateRange, setDateRange] = useState('all')

  // Move useEffect below function definition

  const loadReportsData = async () => {
    // Get task statistics
    let tasks = await getTasks()

    // Filter by employee if not admin
    if (userRole === 'employee' && currentEmployee?.email) {
      tasks = tasks.filter(
        (task) => (task.assignee_email || task.assignee) === currentEmployee.email
      )
    }

    // Filter by date range
    const now = new Date()
    if (dateRange !== 'all') {
      tasks = tasks.filter((task) => {
        const taskDate = new Date(task.created_at || task.createdAt)
        const daysDiff = Math.floor((now - taskDate) / (1000 * 60 * 60 * 24))

        if (dateRange === 'week') return daysDiff <= 7
        if (dateRange === 'month') return daysDiff <= 30
        if (dateRange === 'quarter') return daysDiff <= 90
        return true
      })
    }

    // Calculate stats from filtered tasks
    const taskStats = {
      totals: tasks.length,
      new: tasks.filter((t) => t.status === 'new').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      failed: tasks.filter((t) => t.status === 'failed').length,
    }
    setStats(taskStats)

    // Calculate top performers (only for admin)
    if (userRole === 'admin') {
      const [employees, allTasks] = await Promise.all([getEmployees(), getTasks()])

      const performanceMap = {}
      allTasks.forEach((task) => {
        const assigneeEmail = task.assignee_email || task.assignee
        const assigneeName = task.assignee_name || task.assigneeName

        if (task.status === 'completed') {
          if (!performanceMap[assigneeEmail]) {
            performanceMap[assigneeEmail] = {
              email: assigneeEmail,
              name: assigneeName,
              completed: 0,
              total: 0,
            }
          }
          performanceMap[assigneeEmail].completed++
        }
        if (!performanceMap[assigneeEmail]) {
          performanceMap[assigneeEmail] = {
            email: assigneeEmail,
            name: assigneeName,
            completed: 0,
            total: 0,
          }
        }
        performanceMap[assigneeEmail].total++
      })

      const performers = Object.values(performanceMap)
        .map((p) => ({
          ...p,
          completionRate: p.total > 0 ? (p.completed / p.total) * 100 : 0,
        }))
        .sort((a, b) => b.completed - a.completed)
        .slice(0, 5)

      setTopPerformers(performers)
    }

    // Get recent activity (last 10 task updates) from filtered tasks
    const sortedTasks = [...tasks]
      .sort((a, b) => new Date(b.updated_at || b.updatedAt) - new Date(a.updated_at || a.updatedAt))
      .slice(0, 10)

    setRecentActivity(sortedTasks)
  }

  useEffect(() => {
    loadReportsData()
  }, [dateRange, currentEmployee, userRole])

  const completionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {userRole === 'employee' ? 'My Performance Report' : 'Reports & Analytics'}
            </h1>
            <p className="text-slate-600">
              {userRole === 'employee'
                ? 'Track your personal task performance and progress'
                : 'Track performance metrics and team productivity'}
            </p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white font-medium text-slate-700"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border-2 border-blue-100">
          <div className="text-sm font-semibold text-blue-700 mb-2">Total Tasks</div>
          <div className="text-4xl font-bold text-slate-800">{stats.total}</div>
          <div className="text-xs text-slate-600 mt-2">All time</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-6 border-2 border-green-100">
          <div className="text-sm font-semibold text-green-700 mb-2">Completed</div>
          <div className="text-4xl font-bold text-slate-800">{stats.completed}</div>
          <div className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
            <FaCheck /> {completionRate}% completion rate
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-md p-6 border-2 border-yellow-100">
          <div className="text-sm font-semibold text-yellow-700 mb-2">In Progress</div>
          <div className="text-4xl font-bold text-slate-800">{stats.inProgress}</div>
          <div className="text-xs text-slate-600 mt-2">Active tasks</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6 border-2 border-purple-100">
          <div className="text-sm font-semibold text-purple-700 mb-2">Pending</div>
          <div className="text-4xl font-bold text-slate-800">{stats.new}</div>
          <div className="text-xs text-slate-600 mt-2">Not started</div>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 ${userRole === 'admin' ? 'lg:grid-cols-2' : ''} gap-8 mb-8`}
      >
        {/* Task Completion Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Task Completion Rate</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-green-700">Completed</span>
                <span className="font-bold text-slate-800">
                  {stats.completed} ({completionRate}%)
                </span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-yellow-700">In Progress</span>
                <span className="font-bold text-slate-800">
                  {stats.inProgress} (
                  {stats.total > 0 ? ((stats.inProgress / stats.total) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-blue-700">New</span>
                <span className="font-bold text-slate-800">
                  {stats.new} ({stats.total > 0 ? ((stats.new / stats.total) * 100).toFixed(1) : 0}
                  %)
                </span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.new / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-red-700">Failed</span>
                <span className="font-bold text-slate-800">
                  {stats.failed} (
                  {stats.total > 0 ? ((stats.failed / stats.total) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.failed / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers - Admin Only */}
        {userRole === 'admin' && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Top Performers</h3>
            {topPerformers.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FaTrophy className="text-4xl mb-2 text-yellow-500 mx-auto" />
                <div className="text-sm">No performance data yet</div>
              </div>
            ) : (
              <div className="space-y-4">
                {topPerformers.map((performer, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${
                        idx === 0
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                          : idx === 1
                            ? 'bg-gradient-to-br from-slate-300 to-slate-400'
                            : idx === 2
                              ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                              : 'bg-gradient-to-br from-indigo-400 to-purple-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">{performer.name}</div>
                      <div className="text-xs text-slate-500">
                        {performer.completed} completed / {performer.total} total
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-indigo-600">
                        {performer.completionRate.toFixed(0)}%
                      </div>
                      <div className="text-xs text-slate-500">success rate</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FaClipboardList className="text-4xl mb-2 text-slate-400 mx-auto" />
            <div className="text-sm">No recent activity</div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((task, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    task.status === 'completed'
                      ? 'bg-green-500'
                      : task.status === 'in-progress'
                        ? 'bg-yellow-500'
                        : task.status === 'failed'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                  }`}
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-800 text-sm">{task.title}</div>
                  <div className="text-xs text-slate-500">
                    {task.assignee_name || task.assigneeName} •{' '}
                    {new Date(task.updated_at || task.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    task.status === 'completed'
                      ? 'bg-green-50 text-green-700'
                      : task.status === 'in-progress'
                        ? 'bg-yellow-50 text-yellow-700'
                        : task.status === 'failed'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {task.status.replace('-', ' ').toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports
