import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { Moon, Sun, LogOut, LayoutDashboard, List, PiggyBank, Zap } from 'lucide-react';

const Navbar = ({ darkMode, setDarkMode }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  return (
    <div style={{ backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>FinancePro</h2>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/transactions" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
              <List size={18} /> Transactions
            </Link>
            <Link to="/budget" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
              <PiggyBank size={18} /> Budget
            </Link>
            <Link to="/advisor" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
              <Zap size={18} color="#f59e0b" fill="#f59e0b" /> Advisor
            </Link>
          </nav>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Welcome, {user?.name}</span>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => dispatch(logout())} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--danger-color)', color: 'white' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
