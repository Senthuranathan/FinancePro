import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../store/transactionSlice';
import { Search, Download, Trash2 } from 'lucide-react';

const Transactions = () => {
  const dispatch = useDispatch();
  const { items, totalPages, currentPage, isLoading } = useSelector(state => state.transactions);
  const { user } = useSelector(state => state.auth);
  
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions({ page: 1, search, type }));
  }, [dispatch, search, type]);

  const handlePageChange = (newPage) => {
    dispatch(fetchTransactions({ page: newPage, search, type }));
  };

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...items.map(t => [
        new Date(t.date).toLocaleDateString(),
        `"${t.description}"`,
        t.category,
        t.type,
        t.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete transaction?')) {
      await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      dispatch(fetchTransactions({ page: currentPage, search, type }));
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2>Transactions</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="input-field" 
              style={{ paddingLeft: '35px', margin: 0 }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field" style={{ margin: 0, width: 'auto' }} value={type} onChange={e => setType(e.target.value)}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button onClick={exportCSV} className="btn" style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
            <Download size={18} style={{ marginRight: '0.5rem' }} /> Export
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Description</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
            ) : items.map(t => (
              <tr key={t._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>{new Date(t.date).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>{t.description}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ backgroundColor: 'var(--bg-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                    {t.category}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: t.type === 'income' ? 'var(--accent-color)' : 'var(--text-primary)' }}>
                  {t.type === 'income' ? '+' : '-'}${t.amount}
                </td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => handleDelete(t._id)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => handlePageChange(currentPage - 1)}
            className="btn"
            style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
          >
            Prev
          </button>
          <span style={{ display: 'flex', alignItems: 'center' }}>Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => handlePageChange(currentPage + 1)}
            className="btn"
            style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;
