// src/components/Stats.jsx - UPDATED TO MATCH ACTUAL API RESPONSE
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const Stats = () => {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching admin stats...');
      
      const response = await adminAPI.getStats();
      console.log('📊 Admin stats response:', response);
      
      if (response.success) {
        console.log('✅ Stats data received:', response);
        
        // Use the ACTUAL response structure from your backend
        const {
          total_users,
          active_users, 
          total_transactions,
          total_revenue,
          total_wallet_balance
        } = response;
        
        const formattedStats = [
          {
            id: "stat-total-users",
            title: "Total Users",
            value: total_users?.toString() || "0",
            change: active_users > 0 ? `${active_users} active` : "No active users",
            trend: "up",
          },
          {
            id: "stat-active-users",
            title: "Active Users", 
            value: active_users?.toString() || "0",
            change: total_users > 0 ? 
              `${Math.round((active_users / total_users) * 100)}% of total` : "0%",
            trend: "up",
          },
          {
            id: "stat-total-revenue",
            title: "Total Revenue",
            value: `$${total_revenue?.toFixed(2) || "0.00"}`,
            change: total_transactions > 0 ? 
              `Avg $${(total_revenue / total_transactions).toFixed(2)} per tx` : "No transactions",
            trend: "up",
          },
          {
            id: "stat-total-transactions",
            title: "Total Transactions",
            value: total_transactions?.toString() || "0",
            change: "All completed", // You can update this if you have pending/failed data
            trend: "up",
          }
        ];
        
        setStatsData(formattedStats);
      } else {
        setError('Failed to load statistics: API error');
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load statistics');
      
      // Fallback to empty stats
      setStatsData(getFallbackStats());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackStats = () => [
    {
      id: "stat-total-users",
      title: "Total Users",
      value: "0",
      change: "Loading...",
      trend: "neutral",
    },
    {
      id: "stat-active-users",
      title: "Active Users",
      value: "0", 
      change: "Loading...",
      trend: "neutral",
    },
    {
      id: "stat-total-revenue",
      title: "Total Revenue",
      value: "$0.00",
      change: "Loading...",
      trend: "neutral",
    },
    {
      id: "stat-total-transactions",
      title: "Total Transactions",
      value: "0",
      change: "Loading...",
      trend: "neutral",
    }
  ];

  // Optional: Add period selector
  const PeriodSelector = () => (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="period" style={{ marginRight: '10px' }}>Period: </label>
      <select 
        id="period"
        value={period} 
        onChange={(e) => setPeriod(e.target.value)}
        style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
    </div>
  );

  if (loading) {
    return (
      <div className="stats-dashboard-wrapper">
        <PeriodSelector />
        <div className="stats-grid-container">
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '40px',
            color: '#64748b'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p>Loading statistics...</p>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-dashboard-wrapper">
        <PeriodSelector />
        <div className="stats-grid-container">
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '40px',
            color: '#ef4444'
          }}>
            <p>{error}</p>
            <button 
              onClick={fetchStats}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                background: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-dashboard-wrapper">
      <PeriodSelector />
      <div className="stats-grid-container">
        {statsData.map((stat, index) => (
          <div
            key={index}
            id={stat.id}
            className="stats-card"
          >
            <div className="stats-card-inner">
              <h3 className="stats-card-title">{stat.title}</h3>
              <div className="stats-card-value">{stat.value}</div>
              <div className={`stats-card-change stats-card-change-${stat.trend}`}>
                <span className="stats-change-icon">
                  {stat.trend === "up" ? "↑" : stat.trend === "down" ? "↓" : "•"}
                </span>
                <span className="stats-change-text">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;