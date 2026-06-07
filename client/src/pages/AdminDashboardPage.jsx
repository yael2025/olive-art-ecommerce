import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import * as XLSX from "xlsx";


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

  const bestSeller = stats.topSellingProducts?.[0]

  const exportDashboardReport = () => {
    const summaryData = [
      { Metric: "Orders", Value: stats.totalOrders },
      { Metric: "Revenue", Value: stats.totalRevenue },
      { Metric: "Average Order Value", Value: stats.averageOrderValue },
      { Metric: "Customers", Value: stats.registeredUsers },
      { Metric: "Top Product", Value: bestSeller ? bestSeller.name : "No sales yet" },
    ]
    const ordersStatusData = [
      { Status: "Paid", Count: stats.ordersByStatus.paid },
      { Status: "Not Paid", Count: stats.ordersByStatus.notPaid },
      { Status: "Delivered", Count: stats.ordersByStatus.delivered },
      { Status: "Pending Delivery", Count: stats.ordersByStatus.pendingDelivery },
    ]
    const topProductsData = stats.topSellingProducts.map((product) => ({
      Product: product.name,
      "Quantity Sold": product.quantity,
    }))
    const salesByCategoryData = stats.salesByCategory.map((category) => ({
      Category: category.category,
      Revenue: category.revenue,
    }));
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(summaryData),
      "Summary"
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(ordersStatusData),
      "Orders Status"
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(topProductsData),
      "Top Products"
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(salesByCategoryData),
      "Sales By Category"
    );
    XLSX.writeFile(workbook, "business-dashboard-report.xlsx");
  }

  return (
    <div className="admin-page">
      <div className="dashboard-title-row">
        <h2>Business Dashboard</h2>

        <button className="export-btn" onClick={exportDashboardReport}>
          Export Excel Report
        </button>
      </div>
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
          <h3>Average Order Value</h3>
          <p>₪{stats.averageOrderValue}</p>
        </div>
        <div className="dashboard-card">
          <h3>Best Seller</h3>
          <p>{bestSeller ? bestSeller.name : "No sales yet"}</p>
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

      <div className="dashboard-chart">
        <h3>Sales By Category</h3>

        <BarChart
          width={650}
          height={320}
          data={stats.salesByCategory}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="category"
            interval={0}
            height={70}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" name="Revenue" fill="#8b6a4e" />
        </BarChart>

      </div>
    </div>
  );
}

export default AdminDashboardPage;