// src/pages/UserHomePage.jsx - COMPLETE WITH FETCH API
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserTopNavbar from '../components/UserTopNavbar';
import UserBottomNavbar from '../components/UserBottomNavbar';
import { useAuth } from '../context/AuthContext';
import { transactionAPI, formatCurrency } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

function UserHomePage() {
  const { wallet, refreshWallet, user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState({ sent: 0, received: 0 });
  const balanceData = [
    { month: "Jan", balance: 4200 },
    { month: "Feb", balance: 3900 },
    { month: "Mar", balance: 4700 },
    { month: "Apr", balance: 5100 },
    { month: "May", balance: 4900 },
    { month: "Jun", balance: 5300 },
    { month: "Jul", balance: 5300 },
    { month: "Aug", balance: 5300 },
    { month: "Sep", balance: 5300 },
  ];

  // Fetch transactions on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await transactionAPI.getTransactions('all', 5);
        const txData = response.transactions || [];
        setTransactions(txData);
        
        // Calculate monthly stats
        calculateMonthlyStats(txData);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTransactions();
    }
  }, [user]);

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
          <h2 className="section-title">Balance Overview</h2>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <AreaChart
                data={balanceData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                  }}
                  labelStyle={{ color: "#3B82F6", fontWeight: "600" }}
                  formatter={(value) => [`Balance: ${formatCurrency(value)}`]}
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
    </>
  );
}

export default UserHomePage;