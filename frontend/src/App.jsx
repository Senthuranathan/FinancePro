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
  const { user, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);

  // Auto-login or validate session
  useEffect(() => {
    if (user) {
      dispatch(validateSession());
    } else if (!isLoading) {
      dispatch(loginUser({ email: 'demo@example.com', password: 'password123' }));
    }
  }, [user, isLoading, dispatch]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

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
