import React, { useState } from 'react'
import TaskCard from './TaskCard'
import TaskDetailsModal from './TaskDetailsModal'

const columnsInitial = {
  todo: { id: 'todo', title: 'To Do' },
  inprogress: { id: 'inprogress', title: 'In Progress' },
  done: { id: 'done', title: 'Done' },
}

const TaskBoard = ({ tasks: initialTasks } = {}) => {
  const [tasks, setTasks] = useState(initialTasks ?? employess)
  const [openTask, setOpenTask] = useState(null)

  const onDragOver = (e) => e.preventDefault()

  const onDrop = (e, columnId) => {
    e.preventDefault()
    try {
      const payload = JSON.parse(e.dataTransfer.getData('text/plain'))
      const taskId = payload?.id
      if (!taskId) return

      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: columnId } : t)))
    } catch (err) {
      // ignore malformed data
    }
  }

  const grouped = tasks.reduce((acc, t) => {
    acc[t.status] = acc[t.status] || []
    acc[t.status].push(t)
    return acc
  }, {})

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(columnsInitial).map((col) => (
          <div
            key={col.id}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, col.id)}
            className="min-h-[200px] bg-gray-50 rounded-lg p-3"
          >
            <h3 className="text-sm font-semibold text-slate-700 mb-3">{col.title}</h3>

            <div className="space-y-3">
              {(grouped[col.id] || []).map((task) => (
                <TaskCard key={task.id} task={task} onOpen={(t) => setOpenTask(t)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <TaskDetailsModal task={openTask} onClose={() => setOpenTask(null)} />
    </div>
  )
}

export default TaskBoard
