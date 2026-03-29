import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

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
      setError('Invalid username or password. (Hint: KpsV)');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
            alt="Emblem" 
            className="auth-logo-img"
          />
        </div>
        
        <h1 className="auth-title">KPS Office</h1>
        <p className="auth-subtitle">Secure Government Administration Portal</p>

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
            <ShieldCheck size={20} /> Secure Login
          </button>
        </form>

        <div className="auth-footer">
          Made by Saimanideep · © 2026 KPS Administration
        </div>
      </div>
    </div>
  );
};

export default Login;
