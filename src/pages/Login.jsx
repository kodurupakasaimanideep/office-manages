import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

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
    <div className="auth-container" style={{ 
      background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="auth-card glass-card" style={{ 
        padding: '3rem', 
        borderRadius: '2rem', 
        width: '100%', 
        maxWidth: '460px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        background: 'rgba(15, 23, 42, 0.8)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
            borderRadius: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 0 30px rgba(59,130,246,0.5)'
          }}>
            <ShieldCheck size={40} color="white" />
          </div>
          <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>KPS Secure Access</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: 500 }}>Enter your credentials to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && <div style={{ 
            color: '#f87171', 
            fontSize: '0.85rem', 
            background: 'rgba(239,68,68,0.1)', 
            padding: '0.75rem', 
            borderRadius: '0.75rem', 
            textAlign: 'center',
            border: '1px solid rgba(239,68,68,0.2)'
          }}>{error}</div>}
          
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
              <input
                type="text"
                placeholder="Your username"
                style={{ 
                  width: '100%', 
                  padding: '1rem 1rem 1rem 3rem', 
                  background: 'rgba(30, 41, 59, 0.5)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '1rem', 
                  color: 'white', 
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Access key"
                style={{ 
                  width: '100%', 
                  padding: '1rem 3rem 1rem 3rem', 
                  background: 'rgba(30, 41, 59, 0.5)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '1rem', 
                  color: 'white', 
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" style={{ 
            width: '100%', 
            padding: '1rem', 
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '1rem', 
            fontWeight: 800, 
            fontSize: '1.1rem', 
            cursor: 'pointer',
            boxShadow: '0 8px 16px rgba(37,99,235,0.3)',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            Unlock System <Sparkles size={18} />
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
            {['About', 'Contact', 'Privacy', 'Terms'].map(link => (
                <Link key={link} to={`/${link.toLowerCase()}`} style={{ color: '#64748b', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>{link}</Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
