// src/pages/UserHomePage.jsx - UPDATED WITH REAL DATA & FILTERS
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserTopNavbar from '../components/UserTopNavbar';
import UserBottomNavbar from '../components/UserBottomNavbar';
import { useAuth } from '../context/AuthContext';
import { transactionAPI, formatCurrency, walletAPI } from '../services/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function UserHomePage() {
  const { wallet, refreshWallet, user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState({ sent: 0, received: 0 });
  const [timePeriod, setTimePeriod] = useState('monthly'); // 'weekly', 'monthly', 'yearly'

  // Fetch transactions and chart data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [txResponse, chartResponse] = await Promise.all([
          transactionAPI.getTransactions('all', 5),
          walletAPI.getChartData(timePeriod)
        ]);
        
        const txData = txResponse.transactions || [];
        setTransactions(txData);
        setChartData(chartResponse.data || []);
        
        // Calculate monthly stats
        calculateMonthlyStats(txData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback to dummy data if API fails
        setChartData(generateFallbackData(timePeriod));
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, timePeriod]);

  // Fetch chart data when time period changes
  const fetchChartData = async (period) => {
    try {
      setChartLoading(true);
      const response = await walletAPI.getChartData(period);
      setChartData(response.data || []);
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
      // Fallback to generated data
      setChartData(generateFallbackData(period));
    } finally {
      setChartLoading(false);
    }
  };

  // Handle time period change
  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
    fetchChartData(period);
  };

  // Calculate monthly statistics
  const calculateMonthlyStats = (txData) => {
    const now = new Date();
    const thisMonth = txData.filter(t => {
      const transactionDate = new Date(t.created_at);
      return transactionDate.getMonth() === now.getMonth() && 
             transactionDate.getFullYear() === now.getFullYear();
    });

    const sent = thisMonth
      .filter(t => t.type === 'transfer' && t.sender_id === user?.id)
      .reduce((sum, t) => sum + (t.amount + (t.fee || 0)), 0);

    const received = thisMonth
      .filter(t => (t.type === 'transfer' && t.receiver_id === user?.id) || t.type === 'add_funds')
      .reduce((sum, t) => sum + t.amount, 0);

    setMonthlyStats({ sent, received });
  };

  // Generate fallback data if API fails
  const generateFallbackData = (period) => {
    const currentBalance = wallet?.balance || 0;
    
    if (period === 'weekly') {
      return [
        { label: 'Mon', balance: currentBalance * 0.85 },
        { label: 'Tue', balance: currentBalance * 0.90 },
        { label: 'Wed', balance: currentBalance * 0.88 },
        { label: 'Thu', balance: currentBalance * 0.92 },
        { label: 'Fri', balance: currentBalance * 0.95 },
        { label: 'Sat', balance: currentBalance * 0.98 },
        { label: 'Sun', balance: currentBalance }
      ];
    } else if (period === 'monthly') {
      return [
        { label: 'Week 1', balance: currentBalance * 0.70 },
        { label: 'Week 2', balance: currentBalance * 0.80 },
        { label: 'Week 3', balance: currentBalance * 0.90 },
        { label: 'Week 4', balance: currentBalance }
      ];
    } else { // yearly
      return [
        { label: 'Jan', balance: currentBalance * 0.60 },
        { label: 'Feb', balance: currentBalance * 0.65 },
        { label: 'Mar', balance: currentBalance * 0.70 },
        { label: 'Apr', balance: currentBalance * 0.75 },
        { label: 'May', balance: currentBalance * 0.80 },
        { label: 'Jun', balance: currentBalance * 0.85 },
        { label: 'Jul', balance: currentBalance * 0.90 },
        { label: 'Aug', balance: currentBalance * 0.95 },
        { label: 'Sep', balance: currentBalance },
        { label: 'Oct', balance: currentBalance * 1.05 },
        { label: 'Nov', balance: currentBalance * 1.10 },
        { label: 'Dec', balance: currentBalance * 1.15 }
      ];
    }
  };

  // Auto-refresh wallet every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (refreshWallet) {
        refreshWallet().catch(err => console.error('Failed to refresh wallet:', err));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshWallet]);

  if (loading) {
    return (
      <>
        <UserTopNavbar />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p>Loading your wallet...</p>
          </div>
        </div>
        <UserBottomNavbar />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <UserTopNavbar/>
      <div className="user-home-container">
        {/* Balance Card */}
        <div className="balance-card">
          <div className="balance-header">
            <div>
              <p className="balance-label">Available Balance</p>
              <h1 className="balance-amount">
                {formatCurrency(wallet?.balance || 0)}
              </h1>
            </div>
            <div className="wallet-icon">💵</div>
          </div>
          
          {/* Monthly Stats */}
          <div className="balance-stats">
            <div className="balance-stat">
              <p className="stat-label">Received</p>
              <p className="stat-amount positive">
                +{formatCurrency(monthlyStats.received)}
              </p>
            </div>
            <div className="stat-divider"></div>
            <div className="balance-stat">
              <p className="stat-label">Spent</p>
              <p className="stat-amount negative">
                -{formatCurrency(monthlyStats.sent)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/user/send-money" className="quick-action-card">
              <h3 className="action-title">Send Money</h3>
              <p className="action-desc">Transfer instantly</p>
            </Link>
            <Link to="/user/add-funds" className="quick-action-card">
              <h3 className="action-title">Add Funds</h3>
              <p className="action-desc">Top up wallet</p>
            </Link>
            <Link to="/user/contacts" className="quick-action-card">
              <h3 className="action-title">Contacts</h3>
              <p className="action-desc">Manage Beneficiaries</p>
            </Link>
          </div>
        </div>

        {/* Balance Overview Chart */}
        <div className="balance-overview">
          <div className="chart-header">
            <h2 className="section-title">Balance Overview</h2>
            <div className="time-period-filters">
              <button 
                type="button" // ← ADD THIS: Prevents form submission
                className={`time-filter-btn ${timePeriod === 'weekly' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTimePeriodChange('weekly');
                }}
              >
                Weekly
              </button>
              <button 
                type="button" // ← ADD THIS: Prevents form submission
                className={`time-filter-btn ${timePeriod === 'monthly' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTimePeriodChange('monthly');
                }}
              >
                Monthly
              </button>
              <button 
                type="button" // ← ADD THIS: Prevents form submission
                className={`time-filter-btn ${timePeriod === 'yearly' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTimePeriodChange('yearly');
                }}
              >
                Yearly
              </button>
            </div>
          </div>
          
          <div style={{ width: "100%", height: 250, position: 'relative' }}>
            {chartLoading && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                background: 'rgba(255,255,255,0.8)',
                padding: '10px 20px',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                Loading chart...
              </div>
            )}
            <ResponsiveContainer>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="label" 
                  stroke="#94A3B8" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={12}
                  tickFormatter={(value) => formatCurrency(value).replace('$', '')}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    fontSize: "14px"
                  }}
                  labelStyle={{ color: "#3B82F6", fontWeight: "600" }}
                  formatter={(value) => [formatCurrency(value), 'Balance']}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <br />

        {/* Recent Transactions */}
        <div className="recent-transactions">
          <div className="transactions-header">
            <h2 className="section-title">Recent Transactions</h2>
            <Link to="/user/transactions" className="view-all-link">View All →</Link>
          </div>
          
          <div className="transactions-list">
            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                <p>No transactions yet</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                  Start by adding funds or sending money
                </p>
              </div>
            ) : (
              transactions.map(transaction => {
                const isReceived = transaction.receiver_id === user?.id;
                const isSent = transaction.sender_id === user?.id;
                const displayName = isReceived ? transaction.sender_name : transaction.receiver_name;
                const type = transaction.type === 'add_funds' ? 'received' : (isSent ? 'sent' : 'received');

                return (
                  <div key={transaction.transaction_id} className="transaction-item">
                    <div className="transaction-icon">
                      {type === 'received' ? '💲' : '📤'}
                    </div>
                    <div className="transaction-details">
                      <h4 className="transaction-name">
                        {transaction.type === 'add_funds' 
                          ? 'Added Funds' 
                          : (isReceived ? `From ${displayName}` : `To ${displayName}`)}
                      </h4>
                      <p className="transaction-date">
                        {new Date(transaction.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="transaction-amount">
                      <span className={`amount ${type}`}>
                        {type === 'received' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                      <span className="status">{transaction.status}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <UserBottomNavbar/>

      <style jsx>{`
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .time-period-filters {
          display: flex;
          gap: 8px;
          background: #f8fafc;
          padding: 4px;
          border-radius: 12px;
        }

        .time-filter-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .time-filter-btn:hover {
          background: #e2e8f0;
          color: #334155;
        }

        .time-filter-btn.active {
          background: #3B82F6;
          color: white;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </>
  );
}

export default UserHomePage;