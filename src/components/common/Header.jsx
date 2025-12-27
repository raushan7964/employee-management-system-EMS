import React from 'react'
import { setLocalStorage } from '../../utils/localStorage'
const Header = ({ employee }) => {
  console.log('header', employee)

  return (
    <header className="app-header">
      <div className="container">
        <div className="brand">EM</div>

        <nav className="nav">
          <a href="#dashboard" className="nav-link active">
            Dashboard
          </a>
          <a href="#tasks" className="nav-link">
            Tasks
          </a>
          <a href="#reports" className="nav-link">
            Reports
          </a>
        </nav>

        <div className="actions">
          <div className="user">
            <div className="avatar">{(employee?.firstName || 'E').charAt(0).toUpperCase()}</div>
            <div className="username">{employee?.firstName || 'Employee'}</div>
          </div>
          <button className="btn logout">Logout</button>
        </div>
      </div>

      <style>{`
        .app-header{background:linear-gradient(180deg,#ffffff, #fbfdff);border-bottom:1px solid rgba(15,23,42,0.04);}
        .app-header .container{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:12px 20px;gap:16px}
        .brand{width:44px;height:44px;border-radius:10px;background:#4f46e5;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;box-shadow:0 6px 18px rgba(79,70,229,0.12)}
        .nav{display:flex;gap:12px;flex:1;justify-content:center}
        .nav-link{color:#334155;text-decoration:none;padding:8px 12px;border-radius:8px;font-weight:600;font-size:14px}
        .nav-link.active{background:rgba(79,70,229,0.08);color:#4f46e5}
        .nav-link:hover{background:rgba(15,23,42,0.03)}
        .actions{display:flex;align-items:center;gap:12px}
        .user{display:flex;align-items:center;gap:8px}
        .avatar{width:36px;height:36px;border-radius:9999px;background:#eef2ff;color:#4338ca;display:flex;align-items:center;justify-content:center;font-weight:700}
        .username{font-size:14px;color:#0f172a}
        .btn.logout{background:bg-red-500;border:1px solid rgba(15,23,42,0.06);padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:600;color:#111827}
        .btn.logout:hover{background:rgba(15,23,42,0.03)}
        @media (max-width:720px){
          .nav{display:none}
          .username{display:none}
          .app-header .container{padding:10px}
        }
      `}</style>
    </header>
  )
}

export default Header
