import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import { useTranslation } from "react-i18next";

function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order", error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return <p>{t("orderDetailsPage.loading")}</p>;
  }

  const locale = i18n.language === "he" ? "he-IL" : "en-US";

  return (
    <div className="order-details-page">
      <h2>{t("orderDetailsPage.title")}</h2>

      <div className="order-details-card">
        <p>
          <strong>{t("orderDetailsPage.orderId")}:</strong> {order._id}
        </p>

        <p>
          <strong>{t("orderDetailsPage.user")}:</strong>{" "}
          {order.user?.username}
        </p>

        <p>
          <strong>{t("orderDetailsPage.email")}:</strong>{" "}
          {order.user?.email}
        </p>

        <p>
          <strong>{t("orderDetailsPage.date")}:</strong>{" "}
          {new Date(order.createdAt).toLocaleString(locale)}
        </p>

        <p>
          <strong>{t("orderDetailsPage.payment")}:</strong>{" "}
          <span className={order.isPaid ? "status-paid" : "status-pending"}>
            {order.isPaid
              ? t("orderDetailsPage.paid")
              : t("orderDetailsPage.notPaid")}
          </span>
        </p>

        <p>
          <strong>{t("orderDetailsPage.delivery")}:</strong>{" "}
          <span
            className={
              order.isDelivered ? "status-paid" : "status-pending"
            }
          >
            {order.isDelivered
              ? t("orderDetailsPage.delivered")
              : t("orderDetailsPage.pending")}
          </span>
        </p>
      </div>

      {order.customizationRequest && (
        <div className="personalization-card">
          <h3>
            ✨ {t("orderDetailsPage.personalizationRequest")}
          </h3>

          <p className="personalization-subtitle">
            {t("orderDetailsPage.personalizationSubtitle")}
          </p>

          <div className="personalization-content">
            {order.customizationRequest}
          </div>
        </div>
      )}

      <h3>{t("orderDetailsPage.items")}</h3>

      <div className="order-details-items">
        {order.orderItems.map((item, index) => (
          <div className="order-details-item" key={index}>
            <div>
              <h4>{item.name}</h4>

              <p>
                {t("orderDetailsPage.quantity")}: {item.qty}
              </p>
            </div>

            <div>
              <p>{item.price} ₪</p>
              <strong>{item.price * item.qty} ₪</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="order-details-total">
        <h3>
          {t("orderDetailsPage.total")}: {order.totalPrice} ₪
        </h3>
      </div>
    </div>
  );
}

export default OrderDetailsPage;