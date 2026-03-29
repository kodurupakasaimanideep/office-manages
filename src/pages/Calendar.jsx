import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Holiday database with emoji symbols
const HOLIDAYS = {
  // 2026
  "2026-01-26": { name: "Republic Day", symbol: "🇮🇳", color: "#f59e0b" },
  "2026-03-03": { name: "Holi", symbol: "🎨", color: "#ec4899" },
  "2026-03-04": { name: "Holi", symbol: "🎨", color: "#ec4899" },
  "2026-03-21": { name: "Id-ul-Fitr", symbol: "🌙", color: "#8b5cf6" },
  "2026-03-26": { name: "Ram Navami", symbol: "🪔", color: "#f59e0b" },
  "2026-03-31": { name: "Mahavir Jayanti", symbol: "⚛️", color: "#0ea5e9" },
  "2026-04-03": { name: "Good Friday", symbol: "✝️", color: "#7c3aed" },
  "2026-05-01": { name: "Buddha Purnima", symbol: "☸️", color: "#f59e0b" },
  "2026-05-27": { name: "Bakrid", symbol: "🌙", color: "#8b5cf6" },
  "2026-06-26": { name: "Muharram", symbol: "🌙", color: "#8b5cf6" },
  "2026-08-15": { name: "Independence Day", symbol: "🇮🇳", color: "#16a34a" },
  "2026-08-26": { name: "Id-e-Milad", symbol: "🌙", color: "#8b5cf6" },
  "2026-09-04": { name: "Janmashtami", symbol: "🦚", color: "#3b82f6" },
  "2026-10-02": { name: "Gandhi Jayanti", symbol: "🕊️", color: "#16a34a" },
  "2026-10-20": { name: "Dussehra", symbol: "🏹", color: "#f59e0b" },
  "2026-11-08": { name: "Diwali", symbol: "🪔", color: "#f59e0b" },
  "2026-11-24": { name: "Guru Nanak Jayanti", symbol: "🙏", color: "#f59e0b" },
  "2026-12-25": { name: "Christmas Day", symbol: "🎄", color: "#16a34a" },
  // 2027
  "2027-01-26": { name: "Republic Day", symbol: "🇮🇳", color: "#f59e0b" },
  "2027-03-06": { name: "Maha Shivaratri", symbol: "🕉️", color: "#7c3aed" },
  "2027-03-10": { name: "Eid-ul-Fitar", symbol: "🌙", color: "#8b5cf6" },
  "2027-03-22": { name: "Holi", symbol: "🎨", color: "#ec4899" },
  "2027-03-26": { name: "Good Friday", symbol: "✝️", color: "#7c3aed" },
  "2027-04-15": { name: "Rama Navami", symbol: "🪔", color: "#f59e0b" },
  "2027-04-19": { name: "Mahavir Jayanti", symbol: "⚛️", color: "#0ea5e9" },
  "2027-05-17": { name: "Bakrid", symbol: "🌙", color: "#8b5cf6" },
  "2027-05-20": { name: "Buddha Purnima", symbol: "☸️", color: "#f59e0b" },
  "2027-06-16": { name: "Muharram", symbol: "🌙", color: "#8b5cf6" },
  "2027-08-15": { name: "Independence Day", symbol: "🇮🇳", color: "#16a34a" },
  "2027-08-16": { name: "Id-e-Milad", symbol: "🌙", color: "#8b5cf6" },
  "2027-10-02": { name: "Gandhi Jayanti", symbol: "🕊️", color: "#16a34a" },
  "2027-10-09": { name: "Dussehra", symbol: "🏹", color: "#f59e0b" },
  "2027-10-29": { name: "Diwali", symbol: "🪔", color: "#f59e0b" },
  "2027-11-14": { name: "Guru Nanak Jayanti", symbol: "🙏", color: "#f59e0b" },
  "2027-12-25": { name: "Christmas", symbol: "🎄", color: "#16a34a" },
};

// Weekday gradient colors
const DAY_HEADER_COLORS = [
  '#ef4444', // Sun - red
  '#3b82f6', // Mon - blue
  '#8b5cf6', // Tue - purple
  '#10b981', // Wed - green
  '#f59e0b', // Thu - amber
  '#06b6d4', // Fri - cyan
  '#ec4899', // Sat - pink
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isSecondSaturday = (year, month, day) => {
  const date = new Date(year, month, day);
  if (date.getDay() !== 6) return false;
  return day >= 8 && day <= 14;
};

const TODAY = new Date();

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToPreviousYear = () => setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
  const goToNextYear = () => setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
  const goToToday = () => setCurrentDate(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} style={{
          minHeight: '90px', background: 'rgba(0,0,0,0.02)',
          border: '1px solid var(--border)', borderRadius: '0.25rem'
        }} />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const holiday = HOLIDAYS[dateStr];
      const dateObj = new Date(year, month, day);
      const dayOfWeek = dateObj.getDay();
      const isSunday = dayOfWeek === 0;
      const is2ndSat = isSecondSaturday(year, month, day);
      const isToday = year === TODAY.getFullYear() && month === TODAY.getMonth() && day === TODAY.getDate();
      const isWeekend = isSunday || dayOfWeek === 6;

      let bg = 'var(--card-bg)';
      let numColor = 'var(--text-dark)';

      if (holiday) {
        bg = `${holiday.color}15`;
        numColor = holiday.color;
      } else if (is2ndSat) {
        bg = '#eff6ff';
        numColor = '#3b82f6';
      } else if (isSunday) {
        bg = '#fff1f2';
        numColor = '#ef4444';
      }

      days.push(
        <div key={`day-${day}`} style={{
          minHeight: '90px',
          border: `1px solid ${isToday ? '#3b82f6' : holiday ? `${holiday.color}40` : 'var(--border)'}`,
          borderRadius: '0.375rem',
          background: bg,
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: isToday ? '0 0 0 2px #3b82f6' : 'none',
          transition: 'transform 0.15s, box-shadow 0.15s',
          cursor: 'default',
        }}>
          {/* Day number */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{
              fontWeight: 700,
              fontSize: '1rem',
              color: isToday ? 'white' : numColor,
              background: isToday ? '#3b82f6' : 'transparent',
              width: isToday ? '26px' : 'auto',
              height: isToday ? '26px' : 'auto',
              borderRadius: isToday ? '50%' : '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>{day}</span>
            {holiday && (
              <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{holiday.symbol}</span>
            )}
            {!holiday && is2ndSat && (
              <span style={{ fontSize: '1rem' }}>🏖️</span>
            )}
          </div>

          {/* Holiday badge */}
          {holiday && (
            <div style={{
              marginTop: '0.35rem',
              padding: '0.2rem 0.4rem',
              background: `${holiday.color}20`,
              border: `1px solid ${holiday.color}40`,
              color: holiday.color,
              fontSize: '0.65rem',
              fontWeight: 700,
              borderRadius: '0.25rem',
              lineHeight: '1.2',
              wordBreak: 'break-word',
            }}>
              {holiday.name}
            </div>
          )}
          {!holiday && is2ndSat && (
            <div style={{
              marginTop: '0.35rem',
              padding: '0.2rem 0.4rem',
              background: '#dbeafe',
              border: '1px solid #93c5fd',
              color: '#1d4ed8',
              fontSize: '0.65rem',
              fontWeight: 700,
              borderRadius: '0.25rem',
            }}>
              2nd Saturday
            </div>
          )}
          {!holiday && isSunday && (
            <div style={{
              marginTop: '0.35rem',
              padding: '0.2rem 0.4rem',
              background: '#ffe4e6',
              border: '1px solid #fda4af',
              color: '#be123c',
              fontSize: '0.65rem',
              fontWeight: 700,
              borderRadius: '0.25rem',
            }}>
              Sunday
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // Legend items
  const legendItems = [
    { label: 'National Holiday', color: '#16a34a', symbol: '🇮🇳' },
    { label: 'Religious Holiday', color: '#8b5cf6', symbol: '🙏' },
    { label: '2nd Saturday', color: '#3b82f6', symbol: '🏖️' },
    { label: 'Sunday', color: '#ef4444', symbol: '🔴' },
    { label: 'Today', color: '#3b82f6', symbol: '📍' },
  ];

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>
            📅 Active Calendar
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Public holidays, Second Saturdays & Sundays for {currentDate.getFullYear()}
          </p>
        </div>
        <button onClick={goToToday} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
          📍 Today
        </button>
      </div>

      <div style={{ background: 'var(--card-bg)', borderRadius: '1.25rem', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {/* Nav Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, #1e40af, #7c3aed)',
        }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button onClick={goToPreviousYear} style={navBtnStyle} title="Previous Year">«</button>
            <button onClick={goToPreviousMonth} style={navBtnStyle} title="Previous Month"><ChevronLeft size={16} /></button>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'white', letterSpacing: '0.5px' }}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button onClick={goToNextMonth} style={navBtnStyle} title="Next Month"><ChevronRight size={16} /></button>
            <button onClick={goToNextYear} style={navBtnStyle} title="Next Year">»</button>
          </div>
        </div>

        {/* Day header row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {DAYS_OF_WEEK.map((day, i) => (
            <div key={day} style={{
              padding: '0.6rem',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: 'white',
              background: DAY_HEADER_COLORS[i],
              borderBottom: '2px solid rgba(0,0,0,0.1)',
            }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', padding: '8px', background: 'var(--bg-light)' }}>
          {renderCalendarDays()}
        </div>

        {/* Legend */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', background: 'var(--card-bg)' }}>
          {legendItems.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '1rem' }}>{item.symbol}</span>
              <span style={{ fontWeight: 600, color: item.color }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const navBtnStyle = {
  padding: '0.4rem 0.6rem',
  background: 'rgba(255,255,255,0.15)',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: '0.4rem',
  cursor: 'pointer',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '1rem',
};

export default Calendar;
