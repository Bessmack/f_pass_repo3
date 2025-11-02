import AdminDashboard from "./AdminDashboard";

const AdminWallets = () => {
  const wallets = [
    {
      id: 1,
      name: 'Alice Cooper',
      email: 'alice@example.com',
      balance: '$1250.50',
      status: 'active',
      avatar: '👩'
    },
    {
      id: 2,
      name: 'Bob Martin',
      email: 'bob@example.com',
      balance: '$3420.00',
      status: 'active',
      avatar: '👨'
    },
    {
      id: 3,
      name: 'Carol White',
      email: 'carol@example.com',
      balance: '$800.25',
      status: 'inactive',
      avatar: '👩'
    }
  ];

  const stats = [
    {
      title: 'Total Wallet Balance',
      value: '$13261.50',
      icon: '💰'
    },
    {
      title: 'Average Balance',
      value: '$2652.30',
      icon: '📊'
    },
    {
      title: 'Active Wallets',
      value: '4',
      icon: '👥'
    }
  ];

  return (
    <>
    <AdminDashboard/>
    <div className="admin-wallets">
      <div className="admin-header">
        <h1 className="admin-title">Wallet Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="wallet-stats">
        {stats.map((stat, index) => (
          <div key={index} className="wallet-stat-card">
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <div className="stat-value">{stat.value}</div>
            </div>
            <div className="stat-icon">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="wallets-container">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input 
              type="text" 
              placeholder="Search wallets..." 
              className="search-input"
            />
          </div>
        </div>

        {/* Wallets Table */}
        <div className="wallets-table-container">
          <div className="table-header">
            <div className="table-row header-row">
              <div className="table-cell">User</div>
              <div className="table-cell">Wallet Balance</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Actions</div>
            </div>
          </div>
          
          <div className="table-body">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="table-row">
                <div className="table-cell user-info">
                  <div className="user-avatar">
                    {wallet.avatar}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{wallet.name}</div>
                    <div className="user-email">{wallet.email}</div>
                  </div>
                </div>
                
                <div className="table-cell balance">
                  <span className="balance-amount">{wallet.balance}</span>
                </div>
                
                <div className="table-cell status">
                  <span className={`status-badge ${wallet.status}`}>
                    {wallet.status}
                  </span>
                </div>
                
                <div className="table-cell actions">
                  <div className="wallet-actions">
                    <button className="wallet-btn add-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14m-7-7h14" />
                      </svg>
                      Add
                    </button>
                    <button className="wallet-btn deduct-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" />
                      </svg>
                      Deduct
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminWallets;