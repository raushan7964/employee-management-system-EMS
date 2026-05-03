import React, { useState, useEffect } from 'react'
import { getTaskStats } from '../../utils/taskStorage'

const TaskListNumber = ({ employee }) => {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0,
    failed: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const taskStats = await getTaskStats()
      setStats(taskStats)
    }
    fetchStats()
  }, [])

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border-2 border-blue-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {stats.new}
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">NEW</span>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">{stats.new}</div>
          <div className="text-sm text-slate-600 font-medium">New Tasks</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-md p-6 border-2 border-yellow-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="h-12 w-12 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {stats.inProgress}
            </div>
            <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">ACTIVE</span>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">{stats.inProgress}</div>
          <div className="text-sm text-slate-600 font-medium">In Progress</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-6 border-2 border-green-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="h-12 w-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {stats.completed}
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">DONE</span>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">{stats.completed}</div>
          <div className="text-sm text-slate-600 font-medium">Completed</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-md p-6 border-2 border-red-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="h-12 w-12 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {stats.failed}
            </div>
            <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-full">FAILED</span>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">{stats.failed}</div>
          <div className="text-sm text-slate-600 font-medium">Failed</div>
        </div>
      </div>
    </section>
  )
}

export default TaskListNumber
