import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

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
  const orderStatusData = [
    {
      name: "Paid",
      value: stats.ordersByStatus.paid,
    },
    {
      name: "Not Paid",
      value: stats.ordersByStatus.notPaid,
    },
    {
      name: "Delivered",
      value: stats.ordersByStatus.delivered,
    },
    {
      name: "Pending",
      value: stats.ordersByStatus.pendingDelivery,
    },
  ];

  const COLORS = [
    "#4CAF50",
    "#F44336",
    "#2196F3",
    "#FFC107",
  ];

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

      <div className="dashboard-chart">
        <h3>Orders Status</h3>

        <PieChart width={500} height={300}>
          <Pie
            data={orderStatusData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {orderStatusData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      <div className="dashboard-chart">
        <h3>Top Selling Products</h3>

        <BarChart
          width={650}
          height={320}
          data={stats.topSellingProducts}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={0}
            height={70}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar dataKey="quantity" name="Quantity Sold" fill="#6b4f3a" />
        </BarChart>
      </div>
    </div>
  );
}

export default AdminDashboardPage;