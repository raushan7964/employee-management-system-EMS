import TaskListNumber from '../common/TaskListNumber'
import TaskList from '../../TaskList/TaskList'
import CreateTask from '../common/CreateTask'
import React, { useState, useEffect } from 'react'
import { getTasks, updateTask } from '../../utils/taskStorage'
import { getEmployees } from '../../utils/employeeStorage'
import Toast from '../common/Toast'

const AdminDashboard = () => {
  const [showModal, setShowModal] = useState(false)
  const [employeeStats, setEmployeeStats] = useState([])
  const [pendingTasks, setPendingTasks] = useState([])
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadEmployeeStats()
    loadPendingApprovals()
  }, [])

  const loadPendingApprovals = () => {
    const tasks = getTasks()
    console.log('=== ADMIN DASHBOARD - LOADING PENDING APPROVALS ===')
    console.log('Total tasks found:', tasks.length)

    // Log each task's status
    tasks.forEach((task, index) => {
      console.log(`Task ${index + 1}:`, {
        title: task.title,
        status: task.status,
        approvalStatus: task.approvalStatus,
        assignee: task.assigneeName,
      })
    })

    // Check both approvalStatus field and status field for pending tasks
    const pending = tasks.filter(
      (task) => task.approvalStatus === 'pending' || task.status === 'pending-approval'
    )

    console.log('Pending approval tasks found:', pending.length)
    console.log('Pending tasks:', pending)
    setPendingTasks(pending)
  }

  const handleApprove = (taskId) => {
    const result = updateTask(taskId, {
      approvalStatus: 'approved',
      status: 'new', // Change from pending-approval to new
    })

    if (result.success) {
      setToast({ message: 'Task approved successfully!', type: 'success' })
      loadPendingApprovals()
      loadEmployeeStats()
    } else {
      setToast({ message: `Error: ${result.error}`, type: 'error' })
    }
  }

  const handleReject = (taskId) => {
    const result = updateTask(taskId, {
      approvalStatus: 'rejected',
      status: 'failed',
    })

    if (result.success) {
      setToast({ message: 'Task rejected', type: 'info' })
      loadPendingApprovals()
      loadEmployeeStats()
    } else {
      setToast({ message: `Error: ${result.error}`, type: 'error' })
    }
  }

  const loadEmployeeStats = () => {
    const tasks = getTasks()
    const employees = getEmployees()

    // Calculate task distribution per employee
    const statsMap = {}

    employees.forEach((emp) => {
      statsMap[emp.email] = {
        name: `${emp.firstName} ${emp.lastName}`,
        email: emp.email,
        total: 0,
        new: 0,
        inProgress: 0,
        completed: 0,
        failed: 0,
      }
    })

    tasks.forEach((task) => {
      if (statsMap[task.assignee]) {
        statsMap[task.assignee].total++
        if (task.status === 'new') statsMap[task.assignee].new++
        else if (task.status === 'in-progress') statsMap[task.assignee].inProgress++
        else if (task.status === 'completed') statsMap[task.assignee].completed++
        else if (task.status === 'failed') statsMap[task.assignee].failed++
      }
    })

    const stats = Object.values(statsMap).filter((s) => s.total > 0)
    setEmployeeStats(stats)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Overviews</h1>
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
                ⏰
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
              <div className="text-6xl mb-4">✅</div>
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
                        {new Date(task.dueDate).toLocaleDateString()}
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
                      className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReject(task.id)}
                      className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      ✗ Reject
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
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Employee Task Distribution</h3>

          {employeeStats.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="text-5xl mb-3">📊</div>
              <div className="text-sm">No task data available yet</div>
            </div>
          ) : (
            <div className="space-y-6">
              {employeeStats.map((emp, idx) => {
                const completionRate =
                  emp.total > 0 ? ((emp.completed / emp.total) * 100).toFixed(0) : 0

                return (
                  <div key={idx} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{emp.name}</div>
                          <div className="text-xs text-slate-500">{emp.total} total tasks</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{completionRate}%</div>
                        <div className="text-xs text-slate-500">completion</div>
                      </div>
                    </div>

                    {/* Task breakdown bars */}
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      <div className="text-center">
                        <div className="text-xs font-semibold text-blue-700 mb-1">New</div>
                        <div className="text-lg font-bold text-slate-800">{emp.new}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-semibold text-yellow-700 mb-1">Active</div>
                        <div className="text-lg font-bold text-slate-800">{emp.inProgress}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-semibold text-green-700 mb-1">Done</div>
                        <div className="text-lg font-bold text-slate-800">{emp.completed}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-semibold text-red-700 mb-1">Failed</div>
                        <div className="text-lg font-bold text-slate-800">{emp.failed}</div>
                      </div>
                    </div>

                    {/* Visual progress bar */}
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                      {emp.new > 0 && (
                        <div
                          className="bg-blue-500 transition-all duration-500"
                          style={{ width: `${(emp.new / emp.total) * 100}%` }}
                          title={`${emp.new} new tasks`}
                        />
                      )}
                      {emp.inProgress > 0 && (
                        <div
                          className="bg-yellow-500 transition-all duration-500"
                          style={{ width: `${(emp.inProgress / emp.total) * 100}%` }}
                          title={`${emp.inProgress} in progress`}
                        />
                      )}
                      {emp.completed > 0 && (
                        <div
                          className="bg-green-500 transition-all duration-500"
                          style={{ width: `${(emp.completed / emp.total) * 100}%` }}
                          title={`${emp.completed} completed`}
                        />
                      )}
                      {emp.failed > 0 && (
                        <div
                          className="bg-red-500 transition-all duration-500"
                          style={{ width: `${(emp.failed / emp.total) * 100}%` }}
                          title={`${emp.failed} failed`}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
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
