import { useState, useEffect } from 'react';
import AdminDashboard from "./AdminDashboard";
import { adminAPI } from '../services/api';

const AdminWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  });

  useEffect(() => {
    fetchWallets();
  }, [filters]);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await adminAPI.getAllWallets();
      console.log('💰 Wallets response:', response);
      
      if (response.success) {
        const walletsData = response.data || response.wallets || [];
        setWallets(walletsData);
        calculateStats(walletsData);
      } else {
        setError('Failed to load wallets');
      }
    } catch (err) {
      console.error('Failed to fetch wallets:', err);
      setError(err.message || 'Failed to load wallets');
      setWallets([]);
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (walletsData) => {
    const totalBalance = walletsData.reduce((sum, wallet) => sum + (wallet.balance || 0), 0);
    const activeWallets = walletsData.filter(wallet => wallet.status === 'active').length;
    const averageBalance = walletsData.length > 0 ? totalBalance / walletsData.length : 0;

    const statsData = [
      {
        title: 'TOTAL WALLET BALANCE',
        value: `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: '💰'
      },
      {
        title: 'AVERAGE BALANCE',
        value: `$${averageBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: '📊'
      },
      {
        title: 'ACTIVE WALLETS',
        value: activeWallets.toString(),
        icon: '👥'
      }
    ];
    
    setStats(statsData);
  };

  const getAvatar = (firstName, lastName) => {
    if (!firstName) return '👤';
    const firstLetter = firstName.charAt(0).toUpperCase();
    const emojiMap = {
      'A': '👩', 'B': '👨', 'C': '👩', 'D': '👨', 'E': '👩',
      'F': '👨', 'G': '👩', 'H': '👨', 'I': '👩', 'J': '👨',
      'K': '👩', 'L': '👨', 'M': '👩', 'N': '👨', 'O': '👩',
      'P': '👨', 'Q': '👩', 'R': '👨', 'S': '👩', 'T': '👨',
      'U': '👩', 'V': '👨', 'W': '👩', 'X': '👨', 'Y': '👩', 'Z': '👨'
    };
    return emojiMap[firstLetter] || '👤';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getFullName = (user) => {
    if (user && user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.name || user?.email || 'Unknown User';
  };

  const getStatus = (wallet) => {
    return wallet.status || 'active';
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddFunds = async (walletId, currentBalance) => {
    const amount = prompt('Enter amount to add:');
    if (amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0) {
      try {
        const response = await adminAPI.adjustWallet(walletId, 'add', parseFloat(amount));
        if (response.success) {
          fetchWallets(); // Refresh data
        } else {
          setError(response.message || 'Failed to add funds');
        }
      } catch (err) {
        console.error('Failed to add funds:', err);
        setError(err.message || 'Failed to add funds');
      }
    }
  };

  const handleDeductFunds = async (walletId, currentBalance) => {
    const amount = prompt('Enter amount to deduct:');
    if (amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0) {
      if (parseFloat(amount) > currentBalance) {
        alert('Deduction amount cannot exceed current balance');
        return;
      }
      
      try {
        const response = await adminAPI.adjustWallet(walletId, 'deduct', parseFloat(amount));
        if (response.success) {
          fetchWallets(); // Refresh data
        } else {
          setError(response.message || 'Failed to deduct funds');
        }
      } catch (err) {
        console.error('Failed to deduct funds:', err);
        setError(err.message || 'Failed to deduct funds');
      }
    }
  };

  // Filter wallets based on search and status
  const filteredWallets = wallets.filter(wallet => {
    const user = wallet.user || {};
    const matchesSearch = filters.search === '' || 
      getFullName(user).toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || getStatus(wallet) === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  if (loading && wallets.length === 0) {
    return (
      <>
        <AdminDashboard />
        <div className="admin-wallets">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading wallets...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminDashboard />
      <div className="admin-wallets">
        <div className="admin-header">
          <h1 className="admin-title">Wallet Management</h1>
        </div>

        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
            <button onClick={() => setError('')} className="retry-btn">
              Dismiss
            </button>
          </div>
        )}

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
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          {/* Wallets Table */}
          <div className="wallets-table-container">
            <div className="table-header">
              <div className="table-row header-row">
                <div className="table-cell">USER</div>
                <div className="table-cell">WALLET BALANCE</div>
                <div className="table-cell">STATUS</div>
                <div className="table-cell">ACTIONS</div>
              </div>
            </div>
            
            <div className="table-body">
              {filteredWallets.length === 0 ? (
                <div className="no-data">
                  <p>No wallets found</p>
                  {wallets.length > 0 && filters.search && (
                    <p>Try adjusting your search terms</p>
                  )}
                </div>
              ) : (
                filteredWallets.map((wallet) => {
                  const user = wallet.user || {};
                  return (
                    <div key={wallet.id} className="table-row">
                      <div className="table-cell user-info">
                        <div className="user-avatar">
                          {getAvatar(user.first_name, user.last_name)}
                        </div>
                        <div className="user-details">
                          <div className="user-name">{getFullName(user)}</div>
                          <div className="user-email">{user.email || 'No email'}</div>
                        </div>
                      </div>
                      
                      <div className="table-cell balance">
                        <span className="balance-amount">
                          {formatCurrency(wallet.balance)}
                        </span>
                      </div>
                      
                      <div className="table-cell status">
                        <span className={`status-badge ${getStatus(wallet)}`}>
                          {getStatus(wallet).toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="table-cell actions">
                        <div className="wallet-actions">
                          <button 
                            className="wallet-btn add-btn"
                            onClick={() => handleAddFunds(wallet.id, wallet.balance)}
                            title="Add funds to wallet"
                          >
                            + Add
                          </button>
                          <button 
                            className="wallet-btn deduct-btn"
                            onClick={() => handleDeductFunds(wallet.id, wallet.balance)}
                            title="Deduct funds from wallet"
                          >
                            - Deduct
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminWallets;