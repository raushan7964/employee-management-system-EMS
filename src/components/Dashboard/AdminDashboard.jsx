import TaskListNumber from '../common/TaskListNumber'
import TaskList from '../../TaskList/TaskList'
import CreateTask from '../common/CreateTask'
import React, { useState, useEffect } from 'react'
import { getTasks, updateTask } from '../../utils/taskStorage'
import { getEmployees } from '../../utils/employeeStorage'
import Toast from '../common/Toast'
import { FaClock, FaCheckCircle, FaCheck, FaTimes, FaChartBar, FaCloudUploadAlt } from 'react-icons/fa'
import { hasLegacyData, migrateLegacyData } from '../../utils/migration'

const AdminDashboard = () => {
  const [showModal, setShowModal] = useState(false)
  const [employeeStats, setEmployeeStats] = useState([])
  const [pendingTasks, setPendingTasks] = useState([])
  const [toast, setToast] = useState(null)
  const [showMigrationBanner, setShowMigrationBanner] = useState(hasLegacyData())
  const [isMigrating, setIsMigrating] = useState(false)

  // Move useEffect below function definitions

  const loadPendingApprovals = async () => {
    const tasks = await getTasks()
    
    // Check both approvalStatus field and status field for pending tasks
    const pending = tasks.filter(
      (task) => task.approval_status === 'pending' || task.status === 'pending-approval'
    )

    setPendingTasks(pending)
  }

  const handleApprove = async (taskId) => {
    const result = await updateTask(taskId, {
      approval_status: 'approved',
      status: 'new',
    })

    if (result.success) {
      setToast({ message: 'Task approved successfully!', type: 'success' })
      await loadPendingApprovals()
      await loadEmployeeStats()
    } else {
      setToast({ message: `Error: ${result.error}`, type: 'error' })
    }
  }

  const handleReject = async (taskId) => {
    const result = await updateTask(taskId, {
      approval_status: 'rejected',
      status: 'failed',
    })

    if (result.success) {
      setToast({ message: 'Task rejected', type: 'info' })
      await loadPendingApprovals()
      await loadEmployeeStats()
    } else {
      setToast({ message: `Error: ${result.error}`, type: 'error' })
    }
  }

  const loadEmployeeStats = async () => {
    const [tasks, employees] = await Promise.all([
      getTasks(),
      getEmployees()
    ])

    // Calculate task distribution per employee
    const statsMap = {}

    employees.forEach((emp) => {
      statsMap[emp.email] = {
        name: `${emp.first_name} ${emp.last_name || ''}`,
        email: emp.email,
        total: 0,
        new: 0,
        inProgress: 0,
        completed: 0,
        failed: 0,
      }
    })

    tasks.forEach((task) => {
      const assigneeEmail = task.assignee_email || task.assignee
      if (statsMap[assigneeEmail]) {
        statsMap[assigneeEmail].total++
        if (task.status === 'new') statsMap[assigneeEmail].new++
        else if (task.status === 'in-progress') statsMap[assigneeEmail].inProgress++
        else if (task.status === 'completed') statsMap[assigneeEmail].completed++
        else if (task.status === 'failed') statsMap[assigneeEmail].failed++
      }
    })

    const stats = Object.values(statsMap).filter((s) => s.total > 0)
    setEmployeeStats(stats)
  }

  const handleMigrate = async () => {
    setIsMigrating(true)
    const results = await migrateLegacyData()
    setIsMigrating(false)
    setShowMigrationBanner(false)
    
    if (results.fatalError) {
      setToast({ message: `Migration failed: ${results.fatalError}`, type: 'error' })
    } else {
      setToast({ 
        message: `Successfully migrated ${results.employees} employees, ${results.admins} admins, and ${results.tasks} tasks!`, 
        type: 'success' 
      })
      // Clear legacy storage to prevent re-migration
      localStorage.removeItem('employees')
      localStorage.removeItem('admin')
      localStorage.removeItem('employeeMS_tasks')
      localStorage.removeItem('employeeMS_employees')
      
      // Reload page to see new data
      setTimeout(() => window.location.reload(), 2000)
    }
  }

  useEffect(() => {
    loadEmployeeStats()
    loadPendingApprovals()
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Migration Banner */}
      {showMigrationBanner && (
        <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-md">
              <FaCloudUploadAlt className="text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Legacy Data Detected</h4>
              <p className="text-sm text-slate-600">Would you like to migrate your local data to Supabase?</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleMigrate}
              disabled={isMigrating}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all ${isMigrating ? 'opacity-50' : ''}`}
            >
              {isMigrating ? 'Migrating...' : 'Migrate Now'}
            </button>
            <button
              onClick={() => setShowMigrationBanner(false)}
              className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h1>
        <p className="text-slate-600">Monitor team performance and task progress</p>
      </div>

      {/* Stats */}
      <section className="mb-8">
        <TaskListNumber />
      </section>

      {/* Pending Approvals Section - Always Visible */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-lg p-6 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl">
                <FaClock />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Pending Approvals</h3>
                <p className="text-sm text-slate-600">
                  {pendingTasks.length > 0
                    ? `${pendingTasks.length} employee self-tasks awaiting your review`
                    : 'No pending approvals at the moment'}
                </p>
              </div>
            </div>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <FaCheckCircle className="text-6xl text-green-500 mb-4" />
              <div className="text-lg font-semibold text-slate-800 mb-2">All Caught Up!</div>
              <div className="text-sm text-slate-600">No employee self-tasks pending approval</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-lg shadow-md p-4 border-2 border-orange-200"
                >
                  <div className="mb-3">
                    <h4 className="font-bold text-slate-800 mb-1">{task.title}</h4>
                    <p className="text-sm text-slate-600 line-clamp-2">{task.description}</p>
                  </div>

                  <div className="mb-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500">Created by:</span>
                      <span className="font-semibold text-slate-800">{task.assigneeName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <span className="text-slate-500">Due:</span>
                      <span className="font-semibold text-slate-800">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <span className="text-slate-500">Priority:</span>
                      <span
                        className={`font-semibold ${
                          task.priority === 'urgent'
                            ? 'text-red-600'
                            : task.priority === 'high'
                              ? 'text-orange-600'
                              : task.priority === 'medium'
                                ? 'text-blue-600'
                                : 'text-slate-600'
                        }`}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(task.id)}
                      className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(task.id)}
                      className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Employee Performance Charts */}
      <section className="mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 overflow-hidden">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FaChartBar className="text-indigo-600" /> Employee Task Distribution
          </h3>

          {employeeStats.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FaChartBar className="text-5xl mx-auto mb-3 text-slate-300" />
              <div className="text-sm">No task data available yet</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-2">Employee</th>
                    <th className="py-3 px-2 text-center text-blue-600">New</th>
                    <th className="py-3 px-2 text-center text-yellow-600">Active</th>
                    <th className="py-3 px-2 text-center text-green-600">Completed</th>
                    <th className="py-3 px-2 text-center text-red-600">Failed</th>
                    <th className="py-3 px-2 text-center">Total</th>
                    <th className="py-3 px-2 text-right">Completion</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {employeeStats.map((emp, idx) => {
                    const completionRate =
                      emp.total > 0 ? ((emp.completed / emp.total) * 100).toFixed(0) : 0

                    return (
                      <tr
                        key={idx}
                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                              {emp.name.charAt(0)}
                            </div>
                            <div className="font-medium text-slate-800">{emp.name}</div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-center font-medium text-blue-600">
                          {emp.new}
                        </td>
                        <td className="py-4 px-2 text-center font-medium text-yellow-600">
                          {emp.inProgress}
                        </td>
                        <td className="py-4 px-2 text-center font-medium text-green-600">
                          {emp.completed}
                        </td>
                        <td className="py-4 px-2 text-center font-medium text-red-600">
                          {emp.failed}
                        </td>
                        <td className="py-4 px-2 text-center font-bold text-slate-800">
                          {emp.total}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                              Number(completionRate) >= 80
                                ? 'bg-green-100 text-green-700'
                                : Number(completionRate) >= 50
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {completionRate}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Tasks area */}
      <section>
        <TaskList />
      </section>

      {/* Modal */}
      <CreateTask isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}

export default AdminDashboard
