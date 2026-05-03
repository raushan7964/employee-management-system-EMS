import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTaskById, updateTask, deleteTask, updateTaskStatus } from '../utils/taskStorage'
import Toast from '../components/common/Toast'
import ConfirmDialog from '../components/common/ConfirmDialog'

const TaskDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [toast, setToast] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editData, setEditData] = useState({})

  const loadTask = React.useCallback(async () => {
    const taskData = await getTaskById(id)
    if (taskData) {
      setTask(taskData)
      setEditData(taskData)
    } else {
      setToast({ message: 'Task not found', type: 'error' })
      setTimeout(() => navigate('/tasks'), 2000)
    }
  }, [id, navigate])

  useEffect(() => {
    loadTask()
  }, [loadTask])

  const handleStatusChange = async (newStatus) => {
    const result = await updateTaskStatus(id, newStatus)
    if (result.success) {
      setTask(result.data)
      setToast({ message: 'Status updated successfully!', type: 'success' })
    } else {
      setToast({ message: `Error: ${result.error}`, type: 'error' })
    }
  }

  const handleSaveEdit = async () => {
    const result = await updateTask(id, editData)
    if (result.success) {
      setTask(result.data)
      setIsEditing(false)
      setToast({ message: 'Task updated successfully!', type: 'success' })
    } else {
      setToast({ message: `Error: ${result.error}`, type: 'error' })
    }
  }

  const handleDelete = async () => {
    const result = await deleteTask(id)
    if (result.success) {
      setToast({ message: 'Task deleted successfully!', type: 'success' })
      setTimeout(() => navigate('/tasks'), 1500)
    } else {
      setToast({ message: `Error: ${result.error}`, type: 'error' })
    }
    setShowDeleteDialog(false)
  }

  const getStatusColor = (status) => {
    const colors = {
      'new': 'bg-blue-50 text-blue-700',
      'in-progress': 'bg-yellow-50 text-yellow-700',
      'completed': 'bg-green-50 text-green-700',
      'failed': 'bg-red-50 text-red-700',
    }
    return colors[status] || 'bg-slate-50 text-slate-700'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-slate-50 text-slate-700',
      'medium': 'bg-blue-50 text-blue-700',
      'high': 'bg-orange-50 text-orange-700',
      'urgent': 'bg-red-50 text-red-700',
    }
    return colors[priority] || 'bg-slate-50 text-slate-700'
  }

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">⏳</div>
        <p className="text-slate-600">Loading task...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        confirmText="Delete"
        type="danger"
      />

      <div className="mb-6">
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors"
        >
          <span>←</span>
          <span>Back to Tasks</span>
        </button>
      </div>

      <section className="bg-white rounded-xl shadow-lg p-8 border border-slate-100">
        <div className="flex items-center justify-between mb-6 pb-6 border-b">
          <h2 className="text-2xl font-bold text-slate-800">Task Details</h2>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(task.status)}`}>
              {task.status.replace('-', ' ').toUpperCase()}
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"
            >
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                <select
                  value={editData.priority}
                  onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={editData.dueDate}
                  onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditData(task)
                }}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-2">Title</p>
              <p className="text-lg text-slate-800 font-medium">{task.title}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500 mb-2">Description</p>
              <p className="text-slate-700 leading-relaxed">{task.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Assignee</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-white flex items-center justify-center font-bold">
                    {(task.assignee_name || task.assigneeName || 'U').charAt(0)}
                  </div>
                  <p className="text-slate-800 font-medium">{task.assignee_name || task.assigneeName}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Status</p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={task.approval_status === 'pending' || task.approvalStatus === 'pending'}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 outline-none ${
                        (task.approval_status === 'pending' || task.approvalStatus === 'pending') ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200' : 'cursor-pointer'
                      } ${getStatusColor(task.status)}`}
                    >
                      <option value="new">NEW</option>
                      <option value="in-progress">IN PROGRESS</option>
                      <option value="completed">COMPLETED</option>
                      <option value="failed">FAILED</option>
                    </select>
                    {(task.approval_status === 'pending' || task.approvalStatus === 'pending') && (
                      <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                        Locked (Pending Approval)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Priority</p>
                <span className={`inline-flex px-4 py-2 rounded-lg text-sm font-semibold ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Due Date</p>
                 <p className="text-slate-800 font-medium">{task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : (task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No date')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Category</p>
                <p className="text-slate-800 font-medium capitalize">{task.category}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Created</p>
                 <p className="text-slate-800 font-medium">{new Date(task.created_at || task.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="mt-8 pt-6 border-t flex gap-3">
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="px-6 py-2.5 bg-red-50 text-red-700 rounded-lg font-semibold hover:bg-red-100 transition-colors"
            >
              Delete Task
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default TaskDetails
