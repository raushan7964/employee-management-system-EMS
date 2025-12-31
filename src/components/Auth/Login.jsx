import React from 'react'
import { useState } from 'react'
const Login = ({ handleLogin, toggleView }) => {
  const submitHandler = (e) => {
    e.preventDefault()
    handleLogin(email, password)

    setEmail('')
    setPassword('')
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  return (
    <>
      <div className="login-root">
        <div className="login-card">
          <div className="brand">EM</div>
          <h1 className="title">Sign in to your account</h1>
          <p className="subtitle">Enter your credentials to access the dashboard</p>

          <form onSubmit={submitHandler} className="login-form" action="#" method="post">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={email}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="password-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  value={password}
                />
                <button
                  onClick={() => setShowPassword((s) => !s)}
                  type="button"
                  className="pwd-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn primary">
              Login
            </button>
          </form>
            <div className="signup">
          Don't have an account?{' '}
          <button onClick={toggleView} className="link-btn">
            Sign Up
          </button>
        </div>
        </div>

      

        <style>{`\n        .login-root{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#f1f5f9;font-family:Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial}\n        .login-card{width:100%;max-width:420px;background:#fff;border-radius:14px;box-shadow:0 8px 30px rgba(2,6,23,0.08);padding:34px}\n        .brand{width:56px;height:56px;border-radius:9999px;background:#4f46e5;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;margin:0 auto}\n        .title{margin-top:18px;text-align:center;font-size:20px;font-weight:600;color:#0f172a}\n        .subtitle{margin-top:6px;text-align:center;font-size:13px;color:#64748b}\n        .login-form{margin-top:20px}\n        .field{margin-bottom:14px}\n        .field label{display:block;font-size:13px;color:#334155;margin-bottom:6px}\n        .field input{width:100%;padding:10px 12px;border:1px solid #e6edf3;border-radius:8px;background:#fff;font-size:14px;color:#0f172a}\n        .field input:focus{outline:none;box-shadow:0 0 0 3px rgba(79,70,229,0.08);border-color:#4f46e5}\n        .password-wrap{position:relative}\n        .pwd-toggle{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:transparent;border:none;color:#475569;font-weight:600;cursor:pointer;padding:6px}\n        .row.between{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}\n        .remember{font-size:13px;color:#475569;display:flex;align-items:center;gap:8px}\n        .forgot{font-size:13px;color:#4f46e5;text-decoration:none}\n        .forgot:hover{text-decoration:underline}\n        .btn{display:block;width:100%;padding:11px 14px;border-radius:10px;border:none;font-weight:600;cursor:pointer}\n        .btn.primary{background:#4f46e5;color:#fff}\n        .btn.primary:hover{background:#4338ca}\n        .signup{text-align:center;margin-top:18px;font-size:13px;color:#64748b}\n        .link-btn{background:none;border:none;color:#4f46e5;cursor:pointer;font-weight:600;padding:0;}\n        .link-btn:hover{text-decoration:underline}\n        @media (max-width:420px){.login-card{padding:22px;border-radius:12px}}\n      `}</style>
      </div>
    </>
  )
}

export default Login
