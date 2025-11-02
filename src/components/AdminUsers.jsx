import AdminDashboard from "./AdminDashboard";

const AdminUsers = () => {
  const users = [
    {
      id: 1,
      name: 'Alice Cooper',
      email: 'alice@example.com',
      balance: '$1250.50',
      status: 'active',
      joinDate: '2025-10-10',
      avatar: '👩'
    },
    {
      id: 2,
      name: 'Bob Martin',
      email: 'bob@example.com',
      balance: '$3420.00',
      status: 'active',
      joinDate: '2025-10-09',
      avatar: '👨'
    },
    {
      id: 3,
      name: 'Carol White',
      email: 'carol@example.com',
      balance: '$890.25',
      status: 'inactive',
      joinDate: '2025-10-08',
      avatar: '👩'
    },
    {
      id: 4,
      name: 'David Lee',
      email: 'david@example.com',
      balance: '$5600.75',
      status: 'active',
      joinDate: '2025-10-07',
      avatar: '👨'
    },
    {
      id: 5,
      name: 'Emma Brown',
      email: 'emma@example.com',
      balance: '$2100.00',
      status: 'active',
      joinDate: '2025-10-06',
      avatar: '👩'
    }
  ];

  return (
    <>
    <AdminDashboard/>
    <div className="admin-users">
      <div className="admin-header">
        <h1 className="admin-title">User Management</h1>
        <div className="admin-actions">
          <button className="btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14m-7-7h14" />
            </svg>
            Add User
          </button>
        </div>
      </div>

      <div className="users-container">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input 
              type="text" 
              placeholder="Search users..." 
              className="search-input"
            />
          </div>
          <div className="filter-actions">
            <select className="filter-select">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <button className="btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M7 12h10M5 18h14" />
              </svg>
              Filters
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          <div className="table-header">
            <div className="table-row header-row">
              <div className="table-cell">User</div>
              <div className="table-cell">Balance</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Join Date</div>
              <div className="table-cell">Actions</div>
            </div>
          </div>
          
          <div className="table-body">
            {users.map((user) => (
              <div key={user.id} className="table-row">
                <div className="table-cell user-info">
                  <div className="user-avatar">
                    {user.avatar}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
                
                <div className="table-cell balance">
                  <span className="balance-amount">{user.balance}</span>
                </div>
                
                <div className="table-cell status">
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </div>
                
                <div className="table-cell join-date">
                  {user.joinDate}
                </div>
                
                <div className="table-cell actions">
                  <div className="action-buttons">
                    <button className="icon-btn" title="Edit">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button className="icon-btn" title="View">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button className="icon-btn delete" title="Delete">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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
    </div>
    </>
  );
};

export default AdminUsers;