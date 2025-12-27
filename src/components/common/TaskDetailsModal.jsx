import React from 'react'

const TaskDetailsModal = ({ task, onClose }) => {
  if (!task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
              <p className="text-sm text-slate-500">{task.short || ''}</p>
            </div>
            <div className="text-sm text-slate-500">{task.date ?? ''}</div>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-gray-700">Description</h4>
            <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">{task.description}</p>
          </div>

          <aside className="space-y-3">
            <div>
              <div className="text-xs text-gray-500">Assignee</div>
              <div className="text-sm font-medium text-slate-800">{task.assignee ?? '—'}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Priority</div>
              <div className="text-sm font-medium text-slate-800">{task.priority}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Status</div>
              <div className="text-sm font-medium text-slate-800">{task.status}</div>
            </div>
          </aside>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded-md border text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskDetailsModal
