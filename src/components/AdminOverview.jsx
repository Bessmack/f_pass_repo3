import AdminDashboard from "./AdminDashboard";

const AdminOverview = () => {
  return (
    <>
    <AdminDashboard/>
    <div className="overview">
      <h1 className="overview-title">Dashboard Overview</h1>
      
      <div className="overview-grid">
        {/* Revenue Trend Section */}
        <div className="overview-card">
          <div className="card-header">
            <h2 className="card-title">Revenue Trend</h2>
            <div className="card-actions">
              <button className="action-btn">...</button>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-placeholder">
              <div className="chart-bars">
                <div className="bar" style={{ height: '60%' }}></div>
                <div className="bar" style={{ height: '80%' }}></div>
                <div className="bar" style={{ height: '45%' }}></div>
                <div className="bar" style={{ height: '90%' }}></div>
                <div className="bar" style={{ height: '70%' }}></div>
                <div className="bar" style={{ height: '85%' }}></div>
              </div>
              <div className="chart-labels">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Volume Section */}
        <div className="overview-card">
          <div className="card-header">
            <h2 className="card-title">Transaction Volume</h2>
            <div className="card-actions">
              <button className="action-btn">...</button>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-placeholder">
              <div className="chart-bars">
                <div className="bar" style={{ height: '70%' }}></div>
                <div className="bar" style={{ height: '85%' }}></div>
                <div className="bar" style={{ height: '65%' }}></div>
                <div className="bar" style={{ height: '95%' }}></div>
                <div className="bar" style={{ height: '75%' }}></div>
                <div className="bar" style={{ height: '80%' }}></div>
              </div>
              <div className="chart-labels">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminOverview;