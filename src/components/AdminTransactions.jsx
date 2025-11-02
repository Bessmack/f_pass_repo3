import AdminDashboard from "./AdminDashboard";

const AdminTransactions = () => {
  const transactions = [
    {
      id: 1,
      from: 'Alice Cooper',
      to: 'Bob Martin',
      amount: '$250.00',
      fee: '+$1.25',
      date: '2025-10-15 14:30',
      fromAvatar: '👩',
      toAvatar: '👨'
    },
    {
      id: 2,
      from: 'Carol White',
      to: 'David Lee',
      amount: '$500.00',
      fee: '+$2.50',
      date: '2025-10-15 13:15',
      fromAvatar: '👩',
      toAvatar: '👨'
    },
    {
      id: 3,
      from: 'Emma Brown',
      to: 'Alice Cooper',
      amount: '$150.00',
      fee: '+$0.75',
      date: '2025-10-15 11:45',
      fromAvatar: '👩',
      toAvatar: '👩'
    },
    {
      id: 4,
      from: 'Bob Martin',
      to: 'Carol White',
      amount: '$320.00',
      fee: '+$1.60',
      date: '2025-10-15 10:20',
      fromAvatar: '👨',
      toAvatar: '👩'
    },
    {
      id: 5,
      from: 'David Lee',
      to: 'Emma Brown',
      amount: '$175.00',
      fee: '+$0.88',
      date: '2025-10-15 09:30',
      fromAvatar: '👨',
      toAvatar: '👩'
    }
  ];

  const stats = [
    {
      title: 'Total Transactions',
      value: '1,248',
      change: '+12% from last month',
      trend: 'up',
      icon: '📊'
    },
    {
      title: 'Transaction Volume',
      value: '$268,450',
      change: '+18% from last month',
      trend: 'up',
      icon: '💰'
    },
    {
      title: 'Fee Revenue',
      value: '$1,342.25',
      change: '+15% from last month',
      trend: 'up',
      icon: '💸'
    }
  ];

  return (
    <>
    <AdminDashboard/>
    <div className="admin-transactions">
      <div className="admin-header">
        <h1 className="admin-title">Transaction History</h1>
        <div className="admin-actions">
          <button className="btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 15a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4z" />
              <path d="M7 10V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

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
            {transactions.map((transaction) => (
              <div key={transaction.id} className="table-row">
                <div className="table-cell user-info">
                  <div className="user-avatar small">
                    {transaction.fromAvatar}
                  </div>
                  <div className="user-name">{transaction.from}</div>
                </div>
                
                <div className="table-cell user-info">
                  <div className="user-avatar small">
                    {transaction.toAvatar}
                  </div>
                  <div className="user-name">{transaction.to}</div>
                </div>
                
                <div className="table-cell amount">
                  <span className="amount-value">{transaction.amount}</span>
                </div>
                
                <div className="table-cell fee">
                  <span className="fee-value">{transaction.fee}</span>
                </div>
                
                <div className="table-cell date-time">
                  {transaction.date}
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
            ))}
          </div>
        </div>

        {/* Pagination */}
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
    </>
  );
};

export default AdminTransactions;