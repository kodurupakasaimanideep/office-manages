import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2.5rem', fontFamily: 'sans-serif', lineHeight: '1.6', color: '#1f2937', background: '#fff', borderRadius: '1rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#111827' }}>About</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem', color: '#4b5563' }}>
        This system is used for managing employees, attendance, and office records. This is an internal office management system for authorized users.
      </p>
      <Link to="/" style={{ display: 'inline-block', padding: '0.6rem 1.5rem', background: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: 600 }}>Back to Login</Link>
    </div>
  );
};

export default About;
