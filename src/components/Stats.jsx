import React from 'react';

const Stats = () => {
  const statsData = [
    {
      id: "stat-total-users",
      title: "Total Users",
      value: "5",
      change: "+8.2%",
      trend: "up",
    },
    {
      id: "stat-active-users",
      title: "Active Users",
      value: "4",
      change: "+5.4%",
      trend: "up",
    },
    {
      id: "stat-total-revenue",
      title: "Total Revenue",
      value: "$15,200",
      change: "+12.5%",
      trend: "up",
    },
    {
      id: "stat-avg-transaction",
      title: "Avg. Transaction",
      value: "$215",
      change: "-2.1%",
      trend: "down",
    }
  ];

  return (
    <div className="stats-dashboard-wrapper">
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
                  {stat.trend === "up" ? "↑" : "↓"}
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