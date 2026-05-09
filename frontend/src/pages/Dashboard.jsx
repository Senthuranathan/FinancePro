import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import API_BASE_URL from '../config';
import { logout } from '../store/authSlice';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;
      try {
        setLoading(true);
        const catRes = await fetch(`${API_BASE_URL}/analytics/categories`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (catRes.status === 401) {
          dispatch(logout());
          return;
        }
        if (!catRes.ok) throw new Error('Failed to fetch categories');
        const catData = await catRes.json();
        setCategories(Array.isArray(catData) ? catData : []);

        const trendRes = await fetch(`${API_BASE_URL}/analytics/trends`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (!trendRes.ok) throw new Error('Failed to fetch trends');
        const trendData = await trendRes.json();
        setTrends(Array.isArray(trendData) ? trendData : []);
      } catch (err) {
        console.error('Error fetching analytics', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, dispatch]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger-color)' }}>Error: {error}</div>;

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
