import { useState, useEffect } from 'react';
import AdminDashboard from "./AdminDashboard";
import { adminAPI } from '../services/api';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchTransactionStats();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await adminAPI.getAllTransactions();
      console.log('📊 Transactions response:', response);
      
      if (response.success) {
        setTransactions(response.transactions || []);
      } else {
        setError('Failed to load transactions');
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError(err.message || 'Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionStats = async () => {
    try {
      const response = await adminAPI.getStats();
      console.log('📈 Stats response:', response);
      
      if (response.success) {
        const statsData = [
          {
            title: 'Total Transactions',
            value: response.transactions?.total?.toString() || '0',
            change: response.transactions?.pending > 0 ? 
              `${response.transactions.pending} pending` : 'All completed',
            trend: response.transactions?.failed > 0 ? 'down' : 'up',
            icon: '📊'
          },
          {
            title: 'Transaction Volume',
            value: `$${response.volume?.total?.toLocaleString() || '0'}`,
            change: response.volume?.average_per_transaction ? 
              `Avg $${response.volume.average_per_transaction} per tx` : 'No transactions',
            trend: 'up',
            icon: '💰'
          },
          {
            title: 'Fee Revenue',
            value: `$${response.revenue?.total?.toFixed(2) || '0.00'}`,
            change: response.revenue?.average_per_transaction ? 
              `Avg $${response.revenue.average_per_transaction} per tx` : 'No revenue',
            trend: 'up',
            icon: '💸'
          }
        ];
        setStats(statsData);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Fallback stats
      setStats([
        {
          title: 'Total Transactions',
          value: '0',
          change: 'Loading...',
          trend: 'neutral',
          icon: '📊'
        },
        {
          title: 'Transaction Volume',
          value: '$0',
          change: 'Loading...',
          trend: 'neutral',
          icon: '💰'
        },
        {
          title: 'Fee Revenue',
          value: '$0.00',
          change: 'Loading...',
          trend: 'neutral',
          icon: '💸'
        }
      ]);
    }
  };

  const getAvatar = (name) => {
    if (!name) return '👤';
    const firstLetter = name.charAt(0).toUpperCase();
    const emojiMap = {
      'A': '👩', 'B': '👨', 'C': '👩', 'D': '👨', 'E': '👩',
      'F': '👨', 'G': '👩', 'H': '👨', 'I': '👩', 'J': '👨',
      'K': '👩', 'L': '👨', 'M': '👩', 'N': '👨', 'O': '👩',
      'P': '👨', 'Q': '👩', 'R': '👨', 'S': '👩', 'T': '👨',
      'U': '👩', 'V': '👨', 'W': '👩', 'X': '👨', 'Y': '👩', 'Z': '👨'
    };
    return emojiMap[firstLetter] || '👤';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', '');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const exportReport = () => {
    const headers = ['From', 'To', 'Amount', 'Fee', 'Date & Time'];
    const csvData = transactions.map(tx => [
      tx.sender_name || 'Unknown',
      tx.receiver_name || 'Unknown',
      tx.amount,
      tx.fee,
      formatDate(tx.created_at)
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <>
        <AdminDashboard />
        <div className="admin-transactions">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading transactions...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminDashboard />
      <div className="admin-transactions">
        <div className="admin-header">
          <h1 className="admin-title">Transaction History</h1>
          <div className="admin-actions">
            <button className="btn-primary" onClick={exportReport}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 15a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4z" />
                <path d="M7 10V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5" />
              </svg>
              Export Report
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
            <button onClick={fetchTransactions} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        <div className="transactions-container">
          {/* Transactions Table */}
          <div className="transactions-table-container">
            <div className="table-header">
              <div className="table-row header-row">
                <div className="table-cell">From</div>
                <div className="table-cell">To</div>
                <div className="table-cell">Amount</div>
                <div className="table-cell">Fee</div>
                <div className="table-cell">Date & Time</div>
                <div className="table-cell">Actions</div>
              </div>
            </div>
            
            <div className="table-body">
              {transactions.length === 0 ? (
                <div className="no-data">
                  <p>No transactions found</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id || transaction.transaction_id} className="table-row">
                    <div className="table-cell user-info">
                      <div className="user-avatar small">
                        {getAvatar(transaction.sender_name)}
                      </div>
                      <div className="user-name">{transaction.sender_name || 'Unknown'}</div>
                    </div>
                    
                    <div className="table-cell user-info">
                      <div className="user-avatar small">
                        {getAvatar(transaction.receiver_name)}
                      </div>
                      <div className="user-name">{transaction.receiver_name || 'Unknown'}</div>
                    </div>
                    
                    <div className="table-cell amount">
                      <span className="amount-value">{formatCurrency(transaction.amount)}</span>
                    </div>
                    
                    <div className="table-cell fee">
                      <span className="fee-value">+{formatCurrency(transaction.fee)}</span>
                    </div>
                    
                    <div className="table-cell date-time">
                      {formatDate(transaction.created_at)}
                    </div>
                    
                    <div className="table-cell actions">
                      <div className="action-buttons">
                        <button className="icon-btn" title="View Details">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button className="icon-btn" title="Download Receipt">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          {transactions.length > 0 && (
            <div className="pagination">
              <button className="pagination-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">2</button>
              <button className="pagination-btn">3</button>
              <button className="pagination-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        <br />
        
        {/* Stats Cards */}
        <div className="transaction-stats">
          {stats.map((stat, index) => (
            <div key={index} className="transaction-stat-card">
              <div className="stat-content">
                <h3 className="stat-title">{stat.title}</h3>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.trend}`}>
                  {stat.change}
                </div>
              </div>
              <div className="stat-icon">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #64748b;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3B82F6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        
        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .error-message svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        
        .retry-btn {
          margin-left: auto;
          padding: 4px 12px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .no-data {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default AdminTransactions;