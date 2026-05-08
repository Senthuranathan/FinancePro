import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import API_BASE_URL from '../config';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch(`${API_BASE_URL}/analytics/categories`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const catData = await catRes.json();
        setCategories(catData);

        const trendRes = await fetch(`${API_BASE_URL}/analytics/trends`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const trendData = await trendRes.json();
        setTrends(trendData);
      } catch (error) {
        console.error('Error fetching analytics', error);
      }
    };
    fetchData();
  }, [user.token]);

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Financial Overview</h2>
      
      <div className="dashboard-grid">
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Expense Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categories} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label>
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Monthly Trends</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip wrapperStyle={{ backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)' }} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
