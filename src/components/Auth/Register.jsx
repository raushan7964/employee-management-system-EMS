import React, { useState } from 'react'
import { addEmployee } from '../../utils/employeeStorage'
import { addAdmin } from '../../utils/adminStorage'

const Register = ({ onRegisterSuccess, toggleView }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    role: 'employee', // This is the system role selector (Admin vs Employee)
    department: '',
    jobTitle: '',
  })
  const [error, setError] = useState('')

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')

    // Basic Validation
    if (!formData.firstName || !formData.email || !formData.password) {
      setError('All fields are required')
      return
    }

    // Role-specific validation
    if (formData.role === 'employee') {
      if (!formData.department || !formData.jobTitle) {
        setError('Department and Job Title are required for employees')
        return
      }
    }

    let result
    if (formData.role === 'admin') {
      result = await addAdmin(formData)
    } else {
      const employeeData = {
        firstName: formData.firstName,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        role: formData.jobTitle,
      }
      result = await addEmployee(employeeData)
    }

    if (result.success) {
      alert('Registration successful! Please login.')
      onRegisterSuccess()
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="brand">EM</div>
        <h1 className="title">Create Account</h1>
        <p className="subtitle">Join as an Employee or Admin</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={submitHandler} className="login-form">
          <div className="field">
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="role-select"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="firstName">Full Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="John Doe"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {formData.role === 'employee' && (
            <>
              <div className="field">
                <label htmlFor="department">Department</label>
                <input
                  id="department"
                  type="text"
                  placeholder="e.g. Engineering"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>

              <div className="field">
                <label htmlFor="jobTitle">Job Title</label>
                <input
                  id="jobTitle"
                  type="text"
                  placeholder="e.g. Senior Developer"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn primary">
            Register
          </button>
        </form>

        <div className="signup">
          Already have an account?{' '}
          <button onClick={toggleView} className="link-btn">
            Sign In
          </button>
        </div>
      </div>

      <style>{`
        .login-root { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: #f1f5f9; font-family: Inter, ui-sans-serif, system-ui; }
        .login-card { width: 100%; max-width: 420px; background: #fff; border-radius: 14px; box-shadow: 0 8px 30px rgba(2,6,23,0.08); padding: 34px; }
        .brand { width: 56px; height: 56px; border-radius: 9999px; background: #4f46e5; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto; }
        .title { margin-top: 18px; text-align: center; font-size: 20px; font-weight: 600; color: #0f172a; }
        .subtitle { margin-top: 6px; text-align: center; font-size: 13px; color: #64748b; }
        .error-msg { background: #fee2e2; color: #991b1b; padding: 10px; border-radius: 8px; font-size: 13px; margin-top: 20px; text-align: center; }
        .login-form { margin-top: 20px; }
        .field { margin-bottom: 14px; }
        .field label { display: block; font-size: 13px; color: #334155; margin-bottom: 6px; }
        .field input, .role-select { width: 100%; padding: 10px 12px; border: 1px solid #e6edf3; border-radius: 8px; background: #fff; font-size: 14px; color: #0f172a; }
        .field input:focus, .role-select:focus { outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.08); border-color: #4f46e5; }
        .btn { display: block; width: 100%; padding: 11px 14px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; }
        .btn.primary { background: #4f46e5; color: #fff; }
        .btn.primary:hover { background: #4338ca; }
        .signup { text-align: center; margin-top: 18px; font-size: 13px; color: #64748b; }
        .link-btn { background: none; border: none; color: #4f46e5; cursor: pointer; font-weight: 600; padding: 0; }
        .link-btn:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}

export default Register
