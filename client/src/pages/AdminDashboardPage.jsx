import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();

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
    return <p>{t("dashboardPage.loading")}</p>;
  }

  const orderStatusData = [
    {
      name: t("dashboardPage.paid"),
      value: stats.ordersByStatus.paid,
    },
    {
      name: t("dashboardPage.notPaid"),
      value: stats.ordersByStatus.notPaid,
    },
    {
      name: t("dashboardPage.delivered"),
      value: stats.ordersByStatus.delivered,
    },
    {
      name: t("dashboardPage.pending"),
      value: stats.ordersByStatus.pendingDelivery,
    },
  ];

  const COLORS = [
    "#4CAF50",
    "#F44336",
    "#2196F3",
    "#FFC107",
  ];

  const bestSeller = stats.topSellingProducts?.[0];

  const exportDashboardReport = () => {
    const isHebrew = i18n.language === "he";

    const summaryData = [
      {
        [t("dashboardPage.excelMetric")]: t("dashboardPage.totalOrders"),
        [t("dashboardPage.excelValue")]: stats.totalOrders,
      },
      {
        [t("dashboardPage.excelMetric")]: t("dashboardPage.totalRevenue"),
        [t("dashboardPage.excelValue")]: stats.totalRevenue,
      },
      {
        [t("dashboardPage.excelMetric")]: t("dashboardPage.averageOrderValue"),
        [t("dashboardPage.excelValue")]: stats.averageOrderValue,
      },
      {
        [t("dashboardPage.excelMetric")]: t("dashboardPage.registeredUsers"),
        [t("dashboardPage.excelValue")]: stats.registeredUsers,
      },
      {
        [t("dashboardPage.excelMetric")]: t("dashboardPage.bestSeller"),
        [t("dashboardPage.excelValue")]:
          bestSeller ? bestSeller.name : t("dashboardPage.noSalesYet"),
      },
    ];

    const ordersStatusData = [
      {
        [t("dashboardPage.excelStatus")]: t("dashboardPage.paid"),
        [t("dashboardPage.excelCount")]: stats.ordersByStatus.paid,
      },
      {
        [t("dashboardPage.excelStatus")]: t("dashboardPage.notPaid"),
        [t("dashboardPage.excelCount")]: stats.ordersByStatus.notPaid,
      },
      {
        [t("dashboardPage.excelStatus")]: t("dashboardPage.delivered"),
        [t("dashboardPage.excelCount")]: stats.ordersByStatus.delivered,
      },
      {
        [t("dashboardPage.excelStatus")]: t("dashboardPage.pendingDelivery"),
        [t("dashboardPage.excelCount")]: stats.ordersByStatus.pendingDelivery,
      },
    ];

    const topProductsData = stats.topSellingProducts.map((product) => ({
      [t("dashboardPage.excelProduct")]: product.name,
      [t("dashboardPage.quantitySold")]: product.quantity,
    }));

    const salesByCategoryData = stats.salesByCategory.map((category) => ({
      [t("dashboardPage.excelCategory")]: category.category,
      [t("dashboardPage.revenue")]: category.revenue,
    }));

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(summaryData),
      isHebrew ? "סיכום" : "Summary"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(ordersStatusData),
      isHebrew ? "סטטוס הזמנות" : "Orders Status"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(topProductsData),
      isHebrew ? "מוצרים מובילים" : "Top Products"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(salesByCategoryData),
      isHebrew ? "מכירות לפי קטגוריה" : "Sales By Category"
    );

    XLSX.writeFile(
      workbook,
      isHebrew
        ? "business-dashboard-report-he.xlsx"
        : "business-dashboard-report.xlsx"
    );
  };

  return (
    <div className="admin-page">
      <div className="dashboard-title-row">
        <h2>{t("dashboardPage.title")}</h2>

        <button
          className="export-btn"
          onClick={exportDashboardReport}
        >
          {t("dashboardPage.exportExcel")}
        </button>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>{t("dashboardPage.totalOrders")}</h3>
          <p>{stats.totalOrders}</p>
        </div>

        <div className="dashboard-card">
          <h3>{t("dashboardPage.totalRevenue")}</h3>
          <p>₪{stats.totalRevenue}</p>
        </div>

        <div className="dashboard-card">
          <h3>{t("dashboardPage.averageOrderValue")}</h3>
          <p>₪{stats.averageOrderValue}</p>
        </div>

        <div className="dashboard-card">
          <h3>{t("dashboardPage.bestSeller")}</h3>
          <p>
            {bestSeller
              ? bestSeller.name
              : t("dashboardPage.noSalesYet")}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>{t("dashboardPage.registeredUsers")}</h3>
          <p>{stats.registeredUsers}</p>
        </div>
      </div>

      <div className="dashboard-chart">
        <h3>{t("dashboardPage.ordersStatus")}</h3>

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
        <h3>{t("dashboardPage.topSellingProducts")}</h3>

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

          <Bar
            dataKey="quantity"
            name={t("dashboardPage.quantitySold")}
            fill="#6b4f3a"
          />
        </BarChart>
      </div>

      <div className="dashboard-chart">
        <h3>{t("dashboardPage.salesByCategory")}</h3>

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

          <Bar
            dataKey="revenue"
            name={t("dashboardPage.revenue")}
            fill="#8b6a4e"
          />
        </BarChart>
      </div>
    </div>
  );
}

export default AdminDashboardPage;