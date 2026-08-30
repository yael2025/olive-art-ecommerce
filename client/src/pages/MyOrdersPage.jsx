import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();

        const sortedOrders = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, []);

  const locale = i18n.language === "he" ? "he-IL" : "en-US";

  return (
    <div className="orders-page">
      <h2>{t("myOrdersPage.title")}</h2>

      {orders.length === 0 ? (
        <p className="empty-orders">{t("myOrdersPage.noOrders")}</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <div>
                  <h3>{t("myOrdersPage.order")}</h3>
                  <p className="order-id">{order._id}</p>
                </div>

                <div className="order-meta">
                  <p>
                    {t("myOrdersPage.total")}: {order.totalPrice} ₪
                  </p>

                  <p>
                    {new Date(order.createdAt).toLocaleDateString(locale)}{" "}
                    {new Date(order.createdAt).toLocaleTimeString(locale)}
                  </p>
                </div>
              </div>

              <Link
                to={`/orders/${order._id}`}
                className="details-link"
              >
                {t("myOrdersPage.viewDetails")}
              </Link>

              <div className="order-items">
                {order.orderItems.map((item, index) => (
                  <div className="order-item" key={index}>
                    <div className="order-item-info">
                      <p className="item-name">{item.name}</p>

                      <p className="item-details">
                        {t("myOrdersPage.quantity")}: {item.qty} |{" "}
                        {item.price} ₪
                      </p>
                    </div>

                    <div className="item-total">
                      {item.qty * item.price} ₪
                    </div>
                  </div>
                ))}
              </div>

              {order.customizationRequest && (
                <div className="order-customization-summary">
                  <strong>
                    ✨ {t("myOrdersPage.personalizationIncluded")}
                  </strong>

                  <p>
                    {t("myOrdersPage.personalizationDetails")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;