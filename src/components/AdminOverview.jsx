import { useState, useEffect } from 'react';
import AdminDashboard from "./AdminDashboard";
import { adminAPI } from '../services/api';

const AdminOverview = () => {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState({
    revenue: [],
    transactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch stats
      const statsResponse = await adminAPI.getStats();
      console.log('📊 Stats response:', statsResponse);

      if (statsResponse.success) {
        const data = statsResponse.data || statsResponse;
        const statsData = [
          {
            title: 'Total Revenue',
            value: `$${(data.totalRevenue || data.revenue?.total || 0).toLocaleString()}`,
            change: data.revenueGrowth ? `+${data.revenueGrowth}% from last month` : 'No data',
            trend: 'up',
            icon: '💰'
          },
          {
            title: 'Total Transactions',
            value: (data.totalTransactions || data.transactions?.total || 0).toString(),
            change: data.transactionGrowth ? `+${data.transactionGrowth}% from last month` : 'No data',
            trend: 'up',
            icon: '📊'
          },
          {
            title: 'Active Users',
            value: (data.activeUsers || data.users?.active || 0).toString(),
            change: data.userGrowth ? `+${data.userGrowth}% from last month` : 'No data',
            trend: 'up',
            icon: '👥'
          },
          {
            title: 'Avg. Transaction',
            value: `$${(data.averageTransaction || data.transactions?.average || 0).toFixed(2)}`,
            change: 'Steady growth',
            trend: 'neutral',
            icon: '💸'
          }
        ];
        setStats(statsData);
      }

      // Fetch chart data (mock for now - you can replace with real API)
      const mockChartData = {
        revenue: [12000, 19000, 15000, 25000, 22000, 30000],
        transactions: [450, 620, 580, 810, 720, 890]
      };
      setChartData(mockChartData);

    } catch (err) {
      console.error('Failed to fetch overview data:', err);
      setError(err.message || 'Failed to load overview data');
      
      // Fallback data
      setStats([
        {
          title: 'Total Revenue',
          value: '$0',
          change: 'Loading...',
          trend: 'neutral',
          icon: '💰'
        },
        {
          title: 'Total Transactions',
          value: '0',
          change: 'Loading...',
          trend: 'neutral',
          icon: '📊'
        },
        {
          title: 'Active Users',
          value: '0',
          change: 'Loading...',
          trend: 'neutral',
          icon: '👥'
        },
        {
          title: 'Avg. Transaction',
          value: '$0.00',
          change: 'Loading...',
          trend: 'neutral',
          icon: '💸'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const calculateBarHeight = (value, data, maxHeight = 160) => {
    const maxValue = Math.max(...data);
    return (value / maxValue) * maxHeight;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <>
        <AdminDashboard />
        <div className="admin-overview">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminDashboard />
      <div className="admin-overview">
        <h1 className="overview-title">Dashboard Overview</h1>

        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
            <button onClick={fetchOverviewData} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
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

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Revenue Trend Section */}
          <div className="chart-card">
            <div className="card-header">
              <h2 className="card-title">Revenue Trend</h2>
              <div className="card-actions">
                <select className="period-select">
                  <option>Last 6 months</option>
                  <option>Last 12 months</option>
                  <option>Last 30 days</option>
                </select>
              </div>
            </div>
            <div className="chart-container">
              <div className="chart">
                <div className="chart-bars">
                  {chartData.revenue.map((value, index) => (
                    <div key={index} className="bar-container">
                      <div 
                        className="bar revenue-bar" 
                        style={{ height: `${calculateBarHeight(value, chartData.revenue)}px` }}
                        title={formatCurrency(value)}
                      >
                        <div className="bar-value">{formatCurrency(value)}</div>
                      </div>
                      <span className="bar-label">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Volume Section */}
          <div className="chart-card">
            <div className="card-header">
              <h2 className="card-title">Transaction Volume</h2>
              <div className="card-actions">
                <select className="period-select">
                  <option>Last 6 months</option>
                  <option>Last 12 months</option>
                  <option>Last 30 days</option>
                </select>
              </div>
            </div>
            <div className="chart-container">
              <div className="chart">
                <div className="chart-bars">
                  {chartData.transactions.map((value, index) => (
                    <div key={index} className="bar-container">
                      <div 
                        className="bar transaction-bar" 
                        style={{ height: `${calculateBarHeight(value, chartData.transactions)}px` }}
                        title={`${formatNumber(value)} transactions`}
                      >
                        <div className="bar-value">{formatNumber(value)}</div>
                      </div>
                      <span className="bar-label">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-overview {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .overview-title {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 24px;
        }

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

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-content {
          flex: 1;
        }

        .stat-title {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 8px 0;
          font-weight: 500;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .stat-change {
          font-size: 12px;
          font-weight: 500;
        }

        .stat-change.up {
          color: #059669;
        }

        .stat-change.down {
          color: #dc2626;
        }

        .stat-change.neutral {
          color: #64748b;
        }

        .stat-icon {
          font-size: 32px;
          opacity: 0.8;
        }

        /* Charts Grid */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 24px;
        }

        .chart-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .chart-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .period-select {
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          font-size: 12px;
          color: #64748b;
        }

        .chart-container {
          height: 300px;
          display: flex;
          align-items: flex-end;
        }

        .chart {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .chart-bars {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 200px;
          gap: 16px;
          padding: 0 20px;
        }

        .bar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          height: 100%;
        }

        .bar {
          width: 40px;
          border-radius: 6px 6px 0 0;
          position: relative;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .bar:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }

        .revenue-bar {
          background: linear-gradient(180deg, #3B82F6, #1D4ED8);
        }

        .transaction-bar {
          background: linear-gradient(180deg, #10B981, #059669);
        }

        .bar-value {
          position: absolute;
          top: -25px;
          font-size: 11px;
          font-weight: 600;
          color: #374151;
          background: white;
          padding: 2px 6px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          opacity: 0;
          transition: opacity 0.3s ease;
          white-space: nowrap;
        }

        .bar:hover .bar-value {
          opacity: 1;
        }

        .bar-label {
          margin-top: 8px;
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .admin-overview {
            padding: 16px;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
          }
          
          .chart-card {
            min-width: 100%;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .chart-bars {
            gap: 8px;
            padding: 0 10px;
          }
          
          .bar {
            width: 30px;
          }
        }

        @media (max-width: 480px) {
          .chart-bars {
            gap: 4px;
          }
          
          .bar {
            width: 24px;
          }
          
          .bar-value {
            font-size: 9px;
            top: -20px;
          }
        }
      `}</style>
    </>
  );
};

export default AdminOverview;