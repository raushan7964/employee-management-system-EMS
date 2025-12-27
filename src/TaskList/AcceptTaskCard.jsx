import React from 'react'

// AcceptTaskCard now accepts a `task` prop (stored shape) and optional `assignee` name
const AcceptTaskCard = ({ task, assignee }) => {
  const sample =
    task && Object.keys(task).length
      ? {
          title: task.taskTitle || 'New Task',
          description: task.taskDescription || '',
          priority: task.newtask ? 'High' : task.complete ? 'Low' : 'Medium',
          date: task.taskDate || '',
          assignee: assignee || task.assignee || 'You',
        }
      : {
          title: 'New task',
          description: 'Task description goes here',
          priority: 'Medium',
          date: '',
          assignee: assignee || 'You',
        }

  return (
    <article className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-5 flex gap-4 items-start">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
            {sample.assignee?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{sample.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{sample.description}</p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700">
                {sample.priority}
              </span>
              <div className="mt-2 text-xs text-slate-500">Due</div>
              <div className="text-sm font-medium text-slate-800">{sample.date}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-semibold shadow">
              Accept
            </button>
            <button className="px-4 py-2 rounded-md border border-gray-200 text-sm text-slate-700">
              Decline
            </button>
            <button className="ml-auto text-sm text-indigo-600">View more</button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default AcceptTaskCard
