import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { validateSession } from './store/authSlice';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BudgetPlanner from './pages/BudgetPlanner';
import Advisor from './pages/Advisor';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(validateSession());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  return (
    <Router>
      {user && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}
      <div className="container">
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/transactions" element={user ? <Transactions /> : <Navigate to="/login" />} />
            <Route path="/budget" element={user ? <BudgetPlanner /> : <Navigate to="/login" />} />
            <Route path="/advisor" element={user ? <Advisor /> : <Navigate to="/login" />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
