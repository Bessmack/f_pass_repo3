import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import AdminDashboard from "./AdminDashboard";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the correct method name: getAllUsers
      const response = await adminAPI.getAllUsers();
      
      console.log('Users API response:', response);
      
      // Handle different response structures
      const usersData = response.data || response.users || response;
      
      if (Array.isArray(usersData)) {
        // Transform the data to match our frontend structure
        const transformedUsers = usersData.map(user => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          country: user.country,
          role: user.role,
          status: user.status,
          balance: user.wallet?.balance ? `$${parseFloat(user.wallet.balance).toFixed(2)}` : '$0.00',
          joinDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'Unknown',
          created_at: user.created_at,
          updated_at: user.updated_at,
          wallet: user.wallet
        }));
        
        setUsers(transformedUsers);
      } else {
        // If response is an object with success property, handle accordingly
        if (usersData.success && Array.isArray(usersData.data)) {
          const transformedUsers = usersData.data.map(user => ({
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            country: user.country,
            role: user.role,
            status: user.status,
            balance: user.wallet?.balance ? `$${parseFloat(user.wallet.balance).toFixed(2)}` : '$0.00',
            joinDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'Unknown',
            created_at: user.created_at,
            updated_at: user.updated_at,
            wallet: user.wallet
          }));
          setUsers(transformedUsers);
        } else {
          // If no array found, use fallback
          setUsers(getFallbackUsers());
        }
      }
      
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
      
      // Fallback to dummy data if API fails
      setUsers(getFallbackUsers());
    } finally {
      setLoading(false);
    }
  };

  // Fallback data in case API fails
  const getFallbackUsers = () => {
    return [
      {
        id: 1,
        name: 'Alice Cooper',
        first_name: 'Alice',
        last_name: 'Cooper',
        email: 'alice@example.com',
        phone: '+254712345678',
        country: 'Kenya',
        role: 'user',
        status: 'active',
        balance: '$1250.50',
        joinDate: '2025-10-10',
      },
      {
        id: 2,
        name: 'Bob Martin',
        first_name: 'Bob',
        last_name: 'Martin',
        email: 'bob@example.com',
        phone: '+254723456789',
        country: 'Kenya',
        role: 'user',
        status: 'active',
        balance: '$3420.00',
        joinDate: '2025-10-09',
      },
      {
        id: 3,
        name: 'Carol White',
        first_name: 'Carol',
        last_name: 'White',
        email: 'carol@example.com',
        phone: '+254734567890',
        country: 'Kenya',
        role: 'user',
        status: 'inactive',
        balance: '$890.25',
        joinDate: '2025-10-08',
      }
    ];
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle user actions
  const handleEditUser = async (userId) => {
    try {
      console.log('Editing user:', userId);
      // Fetch specific user data first
      const userData = await adminAPI.getUser(userId);
      console.log('User data:', userData);
      // Then open edit modal or navigate to edit page
      // You can implement a modal or form here
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user details');
    }
  };

  const handleViewUser = async (userId) => {
    try {
      console.log('Viewing user:', userId);
      const userDetails = await adminAPI.getUser(userId);
      console.log('User details:', userDetails);
      // Implement view logic (show modal, navigate to details page, etc.)
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('Failed to fetch user details');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminAPI.deleteUser(userId);
        // Remove user from local state
        setUsers(users.filter(user => user.id !== userId));
        console.log('User deleted successfully');
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user');
      }
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await adminAPI.updateUser(userId, { status: newStatus });
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status');
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await adminAPI.updateUser(userId, { role: newRole });
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
    }
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'status-badge active';
      case 'inactive': return 'status-badge inactive';
      case 'suspended': return 'status-badge suspended';
      default: return 'status-badge';
    }
  };

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-badge admin';
      case 'user': return 'role-badge user';
      default: return 'role-badge';
    }
  };

  if (loading) {
    return (
      <>
        <AdminDashboard />
        <div className="admin-users">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        </div>
      </>
    );
  }

  if (error && users.length === 0) {
    return (
      <>
        <AdminDashboard />
        <div className="admin-users">
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={handleRefresh} className="btn-primary">
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminDashboard />
      <div className="admin-users">
        <div className="admin-header">
          <h1 className="admin-title">User Management</h1>
          <div className="admin-actions">
            <button className="btn-secondary" onClick={handleRefresh} disabled={loading}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

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
                placeholder="Search users by name, email, or phone..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-actions">
              <select 
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              <select 
                className="filter-select"
                onChange={(e) => {
                  if (e.target.value !== 'all') {
                    setSearchTerm(e.target.value);
                  }
                }}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="users-table-container">
            <div className="table-header">
              <div className="table-row header-row">
                <div className="table-cell">User</div>
                <div className="table-cell">Phone</div>
                <div className="table-cell">Balance</div>
                <div className="table-cell">Role</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Join Date</div>
                <div className="table-cell">Actions</div>
              </div>
            </div>
            
            <div className="table-body">
              {filteredUsers.length === 0 ? (
                <div className="no-users">
                  <p>No users found</p>
                  {(searchTerm || statusFilter !== 'all') && (
                    <button 
                      className="btn-link"
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                      }}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user.id} className="table-row">
                    <div className="table-cell user-info">
                      <div className="user-avatar">
                        <div className="avatar-fallback">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                        <div className="user-country">{user.country}</div>
                      </div>
                    </div>
                    
                    <div className="table-cell phone">
                      {user.phone || 'N/A'}
                    </div>
                    
                    <div className="table-cell balance">
                      <span className="balance-amount">
                        {user.balance}
                      </span>
                    </div>
                    
                    <div className="table-cell role">
                      <span className={getRoleBadgeClass(user.role)}>
                        {user.role}
                      </span>
                      {user.role === 'user' && (
                        <button 
                          className="role-toggle"
                          onClick={() => handleRoleUpdate(user.id, 'admin')}
                          title="Make admin"
                        >
                          ⬆️
                        </button>
                      )}
                      {user.role === 'admin' && (
                        <button 
                          className="role-toggle"
                          onClick={() => handleRoleUpdate(user.id, 'user')}
                          title="Make user"
                        >
                          ⬇️
                        </button>
                      )}
                    </div>
                    
                    <div className="table-cell status">
                      <span className={getStatusBadgeClass(user.status)}>
                        {user.status}
                      </span>
                      {user.status !== 'active' && (
                        <button 
                          className="status-toggle"
                          onClick={() => handleStatusUpdate(user.id, 'active')}
                          title="Activate user"
                        >
                          ✅
                        </button>
                      )}
                      {user.status === 'active' && (
                        <button 
                          className="status-toggle inactive"
                          onClick={() => handleStatusUpdate(user.id, 'inactive')}
                          title="Deactivate user"
                        >
                          ⏸️
                        </button>
                      )}
                    </div>
                    
                    <div className="table-cell join-date">
                      {user.joinDate}
                    </div>
                    
                    <div className="table-cell actions">
                      <div className="action-buttons">
                        <button 
                          className="icon-btn" 
                          title="Edit"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button 
                          className="icon-btn" 
                          title="View"
                          onClick={() => handleViewUser(user.id)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        <button 
                          className="icon-btn delete" 
                          title="Delete"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* User Count */}
          <div className="user-count">
            Showing {filteredUsers.length} of {users.length} users
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