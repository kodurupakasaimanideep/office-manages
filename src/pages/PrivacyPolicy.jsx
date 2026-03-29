import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '2rem', fontFamily: 'sans-serif', lineHeight: '1.6', color: '#1f2937', background: '#fff', borderRadius: '1rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#111827' }}>Privacy Policy</h1>
      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '2rem' }}>Last Updated: 2026</p>

      <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#111827' }}>Introduction</h2>
      <p style={{ marginBottom: '1rem' }}>KPS Office Management System is an internal web application used for managing employees, attendance, and office administrative records. This privacy policy explains how we collect, use, and protect information.</p>

      <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#111827' }}>Information We Collect</h2>
      <p style={{ marginBottom: '0.5rem' }}>We may collect the following information:</p>
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
        <li>Username and password</li>
        <li>Employee name and contact details</li>
        <li>Email address</li>
        <li>Attendance records</li>
        <li>Office administrative data</li>
        <li>Login activity and system usage data</li>
      </ul>

      <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#111827' }}>How We Use the Information</h2>
      <p style={{ marginBottom: '0.5rem' }}>The collected information is used for:</p>
      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
        <li>User authentication and login</li>
        <li>Employee management</li>
        <li>Attendance tracking</li>
        <li>Office administration</li>
        <li>Internal record keeping</li>
        <li>System security and monitoring</li>
      </ul>

      <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#111827' }}>Data Protection</h2>
      <p style={{ marginBottom: '1rem' }}>We take appropriate security measures to protect user data. Access to this system is restricted to authorized personnel only. We do not sell, trade, or share personal information with third parties.</p>

      <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#111827' }}>Cookies and Sessions</h2>
      <p style={{ marginBottom: '1rem' }}>This website may use cookies or session storage to maintain login sessions and ensure proper system functionality.</p>

      <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: '#111827' }}>Contact Information</h2>
      <p style={{ marginBottom: '2rem' }}>If you have any questions about this Privacy Policy, contact:<br/><a href="mailto:admin@kps.com" style={{ color: '#2563eb' }}>admin@kps.com</a></p>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', textAlign: 'center' }}>
        <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>&larr; Back to Home</Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
