import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import API_BASE_URL from '../config';

const BudgetPlanner = () => {
  const { user } = useSelector(state => state.auth);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchBudget();
  }, [user, dispatch]);

  const fetchBudget = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/budget`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.status === 401) {
        dispatch({ type: 'auth/logout' });
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch budget');
      const data = await res.json();
      setBudget(data);
    } catch (error) {
      console.error('Error fetching budget', error);
      setBudget({ monthlyIncome: 0, categoryBudgets: {} });
    } finally {
      setLoading(false);
    }
  };

  const handleIncomeChange = (val) => {
    setBudget({ ...budget, monthlyIncome: parseInt(val) || 0 });
  };

  const handleCategoryChange = (category, val) => {
    const updatedBudgets = { ...budget.categoryBudgets, [category]: parseInt(val) || 0 };
    setBudget({ ...budget, categoryBudgets: updatedBudgets });
  };

  const saveBudget = async () => {
    setSaving(true);
    try {
      await fetch(`${API_BASE_URL}/budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          monthlyIncome: budget.monthlyIncome,
          categoryBudgets: budget.categoryBudgets
        })
      });
      alert('Budget saved successfully!');
    } catch (error) {
      console.error('Error saving budget', error);
    }
    setSaving(false);
  };

  if (loading) return <div>Loading budget planner...</div>;

  const totalBudgeted = Object.values(budget.categoryBudgets).reduce((a, b) => a + b, 0);
  const remaining = budget.monthlyIncome - totalBudgeted;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Budget Planner</h2>
        <button className="btn btn-primary" onClick={saveBudget} disabled={saving}>
          {saving ? 'Saving...' : 'Save Budget Plan'}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Monthly Income Target</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>₹</span>
          <input 
            type="number" 
            className="input-field" 
            style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}
            value={budget.monthlyIncome}
            onChange={(e) => handleIncomeChange(e.target.value)}
          />
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Set your total expected income for the month.</p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3>Category Budgets</h3>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '600' }}>
              Total Budgeted: <span style={{ color: totalBudgeted > budget.monthlyIncome ? 'var(--danger-color)' : 'var(--accent-color)' }}>₹{totalBudgeted}</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {remaining >= 0 ? `Remaining: ₹${remaining}` : `Overbudget by ₹${Math.abs(remaining)}`}
            </div>
          </div>
        </div>

        {Object.entries(budget.categoryBudgets).map(([category, amount]) => (
          <div key={category} className="budget-row">
            <div style={{ width: '120px', fontWeight: '500' }}>{category}</div>
            <input 
              type="range" 
              className="budget-slider"
              min="0" 
              max="50000" 
              step="500"
              value={amount}
              onChange={(e) => handleCategoryChange(category, e.target.value)}
            />
            <div style={{ width: '100px', textAlign: 'right' }}>
              <input 
                type="number" 
                className="input-field" 
                style={{ margin: 0, padding: '0.4rem', textAlign: 'right' }}
                value={amount}
                onChange={(e) => handleCategoryChange(category, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetPlanner;
