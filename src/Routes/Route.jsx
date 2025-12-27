import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../Layout/MainLayout'
import Dashboard from '../pages/Dashboard'
import AllTasks from '../pages/AllTasks'
import Task from '../pages/Task'
import TaskDetails from '../pages/TaskDetails'
import Employees from '../pages/Employess'
import Reports from '../pages/Reports'
import Settings from '../pages/Settings'

const AppRoutes = ({ userRole, currentEmployee }) => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout userRole={userRole} currentEmployee={currentEmployee} />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route 
          path="dashboard" 
          element={<Dashboard userRole={userRole} currentEmployee={currentEmployee} />} 
        />
        <Route path="tasks" element={<AllTasks userRole={userRole} currentEmployee={currentEmployee} />} />
        <Route path="tasks/:id" element={<TaskDetails userRole={userRole} currentEmployee={currentEmployee} />} />
        <Route path="task" element={<Task userRole={userRole} currentEmployee={currentEmployee} />} />
        {userRole === 'admin' && (
          <Route path="employees" element={<Employees />} />
        )}
        <Route path="reports" element={<Reports userRole={userRole} currentEmployee={currentEmployee} />} />
        <Route path="settings" element={<Settings userRole={userRole} currentEmployee={currentEmployee} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
