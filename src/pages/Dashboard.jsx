import React from 'react'
import AdminDashboard from '../components/Dashboard/AdminDashboard'
import EmployeeDashboard from '../components/Dashboard/EmployeeDashborad'

const Dashboard = ({ userRole, currentEmployee }) => {
  return (
    <div>
      {userRole === 'admin' ? (
        <AdminDashboard />
      ) : (
        <EmployeeDashboard employee={currentEmployee} />
      )}
    </div>
  )
}

export default Dashboard
