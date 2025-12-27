import React from 'react'

const TaskCard = ({ task, onOpen, draggable = true, role = 'admin', viewer }) => {
  const handleDragStart = (e) => {
    if (!draggable) return
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: task.id }))
    e.dataTransfer.effectAllowed = 'move'
  }

  const belongsToViewer = () => {
    if (!viewer) return false
    const vEmail = viewer.email
    const vName = viewer.firstName
    if (vEmail && task.assigneeEmail) return vEmail === task.assigneeEmail
    if (vName && task.assignee) return vName === task.assignee
    return false
  }

  return (
    <article
      draggable={draggable}
      onDragStart={handleDragStart}
      onClick={() => onOpen && onOpen(task)}
      className="bg-white rounded-md p-4 shadow-sm cursor-pointer hover:shadow-md border border-transparent hover:border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div className="pr-4">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              task.priority === 'High'
                ? 'bg-rose-100 text-rose-700'
                : task.priority === 'Medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
            }`}
          >
            {task.priority}
          </span>

          <h4 className="mt-2 text-sm font-semibold text-slate-800">{task.title}</h4>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">
            {task.short || task.description}
          </p>

          {role === 'admin' ? (
            <div className="mt-2 text-xs text-slate-500">Assignee: {task.assignee ?? '—'}</div>
          ) : null}
        </div>

        <div className="text-xs text-slate-500 text-right">
          <div>{task.date ?? ''}</div>
          {role === 'employee' && belongsToViewer() ? (
            <div className="text-[10px] text-green-600 mt-1">Your task</div>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default TaskCard
