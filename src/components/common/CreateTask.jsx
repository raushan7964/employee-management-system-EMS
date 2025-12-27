import { useState } from 'react'

// Controlled modal: parent controls visibility via `isOpen` and `onClose`
const CreateTask = ({ isOpen = false, onClose = () => {} }) => {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [assignee, setAssignee] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  const handleCreate = (e) => {
    e.preventDefault()
    // For now just log. Replace with real create logic later or call a prop.
    console.log('Create task', { title, priority, assignee, dueDate, description })
    // optionally reset fields
    setTitle('')
    setPriority('Medium')
    setAssignee('')
    setDueDate('')
    setDescription('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Create Task</h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Task title"
                className="w-full px-3 py-2 border rounded-md"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Assignee"
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-3 py-2 border rounded-md h-28"
            />

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTask
