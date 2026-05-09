import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { validateSession, loginUser } from './store/authSlice';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BudgetPlanner from './pages/BudgetPlanner';
import Advisor from './pages/Advisor';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { user, isLoading, error } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);

  // Auto-login or validate session
  useEffect(() => {
    if (user) {
      dispatch(validateSession());
    } else if (!isLoading && !error) {
      dispatch(loginUser({ email: 'demo@example.com', password: 'password123' }));
    }
  }, [user, isLoading, error, dispatch]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger-color)' }}>Connection Error</h2>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', maxWidth: '500px' }}>
          Failed to connect to the backend server. If you just deployed, make sure you added the <code>VITE_API_URL</code> environment variable correctly and redeployed.
        </p>
        <pre style={{ marginTop: '1rem', background: 'var(--surface-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
          {error}
        </pre>
        <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => window.location.reload()}>
          Retry Connection
        </button>
      </div>
    );
  }

  if (!user) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading application...</div>;
  }

  return (
    <Router>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="container">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budget" element={<BudgetPlanner />} />
            <Route path="/advisor" element={<Advisor />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
