import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import vsLogo from '../assets/vs-logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'KpsV') {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo" style={{ background: 'none', boxShadow: 'none', width: '80px', height: '80px' }}>
          <img src={vsLogo} alt="VS Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h1 className="auth-title" style={{ fontSize: '1.4rem', marginTop: '1rem' }}>KPS Office Management System</h1>
        <p className="auth-subtitle">Employee Management System</p>

        <form className="auth-form" onSubmit={handleLogin}>
          {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
          
          <div className="form-group">
            <label className="form-label">
              <User size={14} /> USERNAME
            </label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                type="text"
                className="auth-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={14} /> PASSWORD
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-button">
            <Lock size={20} /> Sign In
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#6b7280' }}>
          <div style={{ marginBottom: '0.5rem' }}>© 2026 KPS Office Management</div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/about" style={{ color: '#2563eb', textDecoration: 'none' }}>About</Link>
            <span>|</span>
            <Link to="/contact" style={{ color: '#2563eb', textDecoration: 'none' }}>Contact</Link>
            <span>|</span>
            <Link to="/privacy-policy" style={{ color: '#2563eb', textDecoration: 'none' }}>Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" style={{ color: '#2563eb', textDecoration: 'none' }}>Terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
