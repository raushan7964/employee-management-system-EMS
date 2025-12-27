import React from 'react'

const FailedTask = ({ employee }) => {
  console.log('failed', employee)

  return (
    <section className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow rounded-2xl border border-gray-100 overflow-hidden">
        <header className="p-6 flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-rose-50 text-rose-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9h2v5H9V9zm0-3h2v2H9V6z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">{employee.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{employee.description}</p>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500">Failed</div>
            <div className="text-sm font-medium text-slate-800">{employee.failedOn}</div>
          </div>
        </header>

        <div className="p-6 border-t bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-700">Failure reason</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{employee.reason}</p>

            <div className="mt-6 flex items-center gap-3">
              <button className="px-4 py-2 rounded-md bg-amber-600 text-white font-semibold shadow">
                Retry
              </button>
              <button className="px-4 py-2 rounded-md border border-gray-200 text-sm text-slate-700">
                Report
              </button>
              <button className="ml-auto text-sm text-indigo-600">View logs</button>
            </div>
          </div>

          <aside className="space-y-3">
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-xs text-gray-500">Failed by</div>
              <div className="font-medium">{employee.failedBy}</div>
            </div>

            <div className="bg-white rounded-lg p-3 border">
              <div className="text-xs text-gray-500">Status</div>
              <div className="font-medium text-rose-600">Failed</div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default FailedTask
