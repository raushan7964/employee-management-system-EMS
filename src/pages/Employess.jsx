import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../Context/AuthProvider'
import { getEmployees, deleteEmployee } from '../utils/employeeStorage'
import EmployeeModal from '../components/common/EmployeeModal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Toast from '../components/common/Toast'

const Employees = () => {
  const data = useContext(AuthContext)
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = () => {
    const allEmployees = getEmployees()
    setEmployees(allEmployees)
  }

  const filteredEmployees = employees.filter((emp) => {
    const name = `${emp.firstName} ${emp.lastName}`.toLowerCase()
    const email = emp.email.toLowerCase()
    return (
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    )
  })

  const handleInvite = () => {
    setSelectedEmployee(null)
    setShowModal(true)
  }

  const handleEdit = (employee) => {
    setSelectedEmployee(employee)
    setShowModal(true)
  }

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    const result = deleteEmployee(employeeToDelete.id)
    if (result.success) {
      setToast({ message: 'Employee removed successfully!', type: 'success' })
      loadEmployees()
    } else {
      setToast({ message: `Error: ${result.error}`, type: 'error' })
    }
    setShowDeleteDialog(false)
    setEmployeeToDelete(null)
  }

  const handleModalSuccess = () => {
    loadEmployees()
  }

  return (
    <div className="max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <EmployeeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        employee={selectedEmployee}
        onSuccess={handleModalSuccess}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Remove Employee"
        message={`Are you sure you want to remove ${employeeToDelete?.firstName} ${employeeToDelete?.lastName}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
        confirmText="Remove"
        type="danger"
      />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Team Members</h1>
            <p className="text-slate-600">Manage your team and their information ({filteredEmployees.length} employees)</p>
          </div>
          <button 
            onClick={handleInvite}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>+</span>
            <span>Invite Employee</span>
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search employees by name or email..."
            className="w-full px-4 py-3 pl-12 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <div className="text-lg font-semibold text-slate-800 mb-2">No employees found</div>
            <div className="text-sm text-slate-500">
              {searchTerm ? 'Try adjusting your search' : 'Invite your first team member to get started'}
            </div>
          </div>
        ) : (
          filteredEmployees.map((e, idx) => {
            const initial = e.firstName.charAt(0).toUpperCase()
            const gradients = [
              'from-pink-400 to-rose-500',
              'from-blue-400 to-cyan-500',
              'from-emerald-400 to-teal-500',
              'from-purple-400 to-indigo-500',
              'from-orange-400 to-red-500',
              'from-green-400 to-emerald-500',
            ]
            const gradient = gradients[idx % gradients.length]

            return (
              <article
                key={e.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 border border-slate-100 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`h-20 w-20 rounded-full bg-gradient-to-br ${gradient} text-white flex items-center justify-center font-bold text-2xl shadow-lg mb-4`}
                  >
                    {initial}
                  </div>
                  <div className="font-bold text-lg text-slate-800 mb-1">
                    {e.firstName} {e.lastName}
                  </div>
                  <div className="text-sm text-slate-500 mb-3">{e.email}</div>
                  <div className="inline-flex px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold mb-2">
                    {e.role}
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Department:</span> {e.department}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                  <button 
                    onClick={() => handleEdit(e)}
                    className="flex-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(e)}
                    className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Employees
