import React from 'react'

const AllTask = () => {
  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between py-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">All Tasks</h2>
          <p className="text-sm text-slate-500">View and manage every task in the system</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            className="px-3 py-2 border rounded-md text-sm w-64"
            placeholder="Search tasks..."
          />
          <select className="px-3 py-2 border rounded-md text-sm">
            <option>All status</option>
            <option>New</option>
            <option>Accepted</option>
            <option>Completed</option>
            <option>Failed</option>
          </select>
          <button className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm">
            New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {/* Card example 1 */}
        <article className="bg-white rounded-xl shadow p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                High
              </span>
              <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                AB
              </div>
              <div>
                <div className="text-sm font-medium text-slate-800">Alex Brown</div>
                <div className="text-xs text-slate-500">Finance • Due: Dec 24</div>
              </div>
            </div>
            <div className="text-sm text-slate-500">Dec 20, 2025</div>
          </div>

          <h3 className="mt-3 text-lg font-semibold text-slate-800">Prepare monthly report</h3>
          <p className="mt-2 text-sm text-slate-500">
            Compile revenue, expenses and KPIs for the month and prepare slides for leadership
            review.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-slate-500">Task ID: #1245</div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-sky-100 text-sky-700">
                New
              </span>
              <button className="text-xs px-2 py-1 border rounded-md">View</button>
            </div>
          </div>
        </article>

        {/* Card example 2 */}
        <article className="bg-white rounded-xl shadow p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                Medium
              </span>
              <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                RC
              </div>
              <div>
                <div className="text-sm font-medium text-slate-800">Rita Charles</div>
                <div className="text-xs text-slate-500">Sales • Due: Dec 21</div>
              </div>
            </div>
            <div className="text-sm text-slate-500">Dec 18, 2025</div>
          </div>

          <h3 className="mt-3 text-lg font-semibold text-slate-800">Client follow-up</h3>
          <p className="mt-2 text-sm text-slate-500">
            Reach out to potential leads from last week's conference and update CRM notes.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-slate-500">Task ID: #1246</div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-indigo-100 text-indigo-700">
                Accepted
              </span>
              <button className="text-xs px-2 py-1 border rounded-md">View</button>
            </div>
          </div>
        </article>

        {/* Card example 3 */}
        <article className="bg-white rounded-xl shadow p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                Low
              </span>
              <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                MK
              </div>
              <div>
                <div className="text-sm font-medium text-slate-800">Mark King</div>
                <div className="text-xs text-slate-500">Engineering • Due: Dec 27</div>
              </div>
            </div>
            <div className="text-sm text-slate-500">Dec 17, 2025</div>
          </div>

          <h3 className="mt-3 text-lg font-semibold text-slate-800">Deploy update to staging</h3>
          <p className="mt-2 text-sm text-slate-500">
            Deploy the latest release candidate to staging and run smoke tests.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-slate-500">Task ID: #1247</div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-emerald-100 text-emerald-700">
                Completed
              </span>
              <button className="text-xs px-2 py-1 border rounded-md">View</button>
            </div>
          </div>
        </article>

        {/* Card example 4 */}
        <article className="bg-white rounded-xl shadow p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                High
              </span>
              <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                JL
              </div>
              <div>
                <div className="text-sm font-medium text-slate-800">Jill Lee</div>
                <div className="text-xs text-slate-500">Engineering • Due: Dec 20</div>
              </div>
            </div>
            <div className="text-sm text-slate-500">Dec 15, 2025</div>
          </div>

          <h3 className="mt-3 text-lg font-semibold text-slate-800">Fix login bug</h3>
          <p className="mt-2 text-sm text-slate-500">
            Investigate and resolve the authentication issue affecting some users.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-slate-500">Task ID: #1248</div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-rose-100 text-rose-700">
                Failed
              </span>
              <button className="text-xs px-2 py-1 border rounded-md">View</button>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

export default AllTask
