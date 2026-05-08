import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_BASE_URL from '../config';

const Advisor = () => {
  const { user } = useSelector(state => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch actual spending
        const catRes = await fetch(`${API_BASE_URL}/analytics/categories`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const actualSpending = await catRes.json();

        // Fetch budget
        const budgetRes = await fetch(`${API_BASE_URL}/budget`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const budgetData = await budgetRes.json();

        setData({ actual: actualSpending, budget: budgetData });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching advisor data', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [user.token]);

  if (loading) return <div>Analyzing your finances...</div>;

  const { actual, budget } = data;
  const advice = [];
  const chartData = [];

  // Logic to generate advice
  Object.entries(budget.categoryBudgets).forEach(([category, limit]) => {
    const actualItem = actual.find(item => item._id === category);
    const spent = actualItem ? actualItem.total : 0;
    const percent = limit > 0 ? (spent / limit) * 100 : 0;

    chartData.push({
      name: category,
      Budget: limit,
      Actual: spent
    });

    if (percent > 100) {
      advice.push({
        type: 'critical',
        category,
        message: `You've exceeded your ${category} budget by ₹${spent - limit}. Consider cutting back on non-essential ${category} purchases immediately.`
      });
    } else if (percent > 85) {
      advice.push({
        type: 'warning',
        category,
        message: `Your ${category} spending is at ${percent.toFixed(1)}% of your limit. You have only ₹${limit - spent} left for the month.`
      });
    } else if (spent > 0) {
      advice.push({
        type: 'success',
        category,
        message: `Great control on ${category}! You are well within your limit with ₹${limit - spent} remaining.`
      });
    }
  });

  const totalSpent = actual.reduce((a, b) => a + b.total, 0);
  const totalBudget = Object.values(budget.categoryBudgets).reduce((a, b) => a + b, 0);
  const savingsRate = budget.monthlyIncome > 0 ? ((budget.monthlyIncome - totalSpent) / budget.monthlyIncome) * 100 : 0;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>AI Financial Advisor</h2>

      <div className="dashboard-grid">
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Personalized Savings Advice</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {advice.length > 0 ? advice.map((item, i) => (
              <div key={i} className={`card advice-card ${item.type}`} style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}>
                <div style={{ fontSize: '1.5rem' }}>
                  {item.type === 'critical' ? '🔴' : item.type === 'warning' ? '🟡' : '🟢'}
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.category}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.message}</div>
                </div>
              </div>
            )) : <p>No data to analyze yet. Start adding transactions!</p>}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Budget vs. Actual Spending</h3>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, top: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} style={{ fontSize: '0.8rem', fill: 'var(--text-secondary)' }} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                <Legend verticalAlign="top" align="right" />
                <Bar dataKey="Budget" fill="var(--border-color)" radius={[0, 4, 4, 0]} barSize={20} />
                <Bar dataKey="Actual" fill="var(--primary-color)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Monthly Health Check</h3>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '500' }}>Overall Savings Rate</span>
              <span style={{ fontWeight: '600', color: savingsRate > 20 ? 'var(--accent-color)' : savingsRate > 0 ? '#f59e0b' : 'var(--danger-color)' }}>
                {savingsRate.toFixed(1)}%
              </span>
            </div>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${Math.min(Math.max(savingsRate, 0), 100)}%`, 
                  backgroundColor: savingsRate > 20 ? 'var(--accent-color)' : savingsRate > 0 ? '#f59e0b' : 'var(--danger-color)' 
                }} 
              />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Target savings rate is 20%. {savingsRate < 20 ? "You're below target. Try to reduce discretionary spending." : "You're doing great! Consider investing the surplus."}
            </p>
          </div>

          <div>
            <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <span className="badge badge-success">Income</span> ₹{budget.monthlyIncome}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span className="badge badge-danger">Spent</span> ₹{totalSpent}
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', fontWeight: 'bold' }}>
                Net Flow: <span style={{ color: (budget.monthlyIncome - totalSpent) >= 0 ? 'var(--accent-color)' : 'var(--danger-color)' }}>
                  ₹{budget.monthlyIncome - totalSpent}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advisor;
