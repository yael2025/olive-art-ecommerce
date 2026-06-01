import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>
  
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
  
        <div className="dashboard-card">
          <h3>Total Revenue</h3>
          <p>₪{stats.totalRevenue}</p>
        </div>
  
        <div className="dashboard-card">
          <h3>Registered Users</h3>
          <p>{stats.registeredUsers}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;