import React, { useState, useEffect } from 'react'
import Toast from '../components/common/Toast'

const Settings = ({ userRole, currentEmployee }) => {
  const [activeTab, setActiveTab] = useState('profile')
  const [toast, setToast] = useState(null)
  
  const [profileData, setProfileData] = useState({
    firstName: currentEmployee?.firstName || '',
    lastName: currentEmployee?.lastName || '',
    email: currentEmployee?.email || '',
    phone: '',
    department: currentEmployee?.department || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskAssigned: true,
    taskCompleted: false,
    weeklyReport: true,
  })

  useEffect(() => {
    // Load notification preferences from localStorage
    const savedPrefs = localStorage.getItem('notificationPreferences')
    if (savedPrefs) {
      setNotifications(JSON.parse(savedPrefs))
    }
  }, [])

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would update the user profile in the backend
    setToast({ message: 'Profile updated successfully!', type: 'success' })
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setToast({ message: 'Please fill in all password fields', type: 'error' })
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ message: 'New passwords do not match!', type: 'error' })
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' })
      return
    }
    
    // In a real app, this would verify current password and update in backend
    setToast({ message: 'Password changed successfully!', type: 'success' })
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleNotificationChange = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] }
    setNotifications(updated)
    // Save to localStorage
    localStorage.setItem('notificationPreferences', JSON.stringify(updated))
    setToast({ message: 'Notification preferences saved!', type: 'success' })
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'password', label: 'Password', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold text-sm transition-all ${
              activeTab === tab.id
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Profile Information</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                <input
                  type="text"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
              { key: 'taskAssigned', label: 'Task Assigned', description: 'Get notified when a task is assigned to you' },
              { key: 'taskCompleted', label: 'Task Completed', description: 'Get notified when your tasks are completed' },
              { key: 'weeklyReport', label: 'Weekly Report', description: 'Receive weekly performance reports' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div>
                  <div className="font-semibold text-slate-800">{item.label}</div>
                  <div className="text-sm text-slate-600">{item.description}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNotificationChange(item.key)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    notifications[item.key] ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      notifications[item.key] ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
