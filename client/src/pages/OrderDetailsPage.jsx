import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";

function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

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
    return <p>Loading order...</p>;
  }

  return (
    <div className="order-details-page">
      <h2>Order Details</h2>

      <div className="order-details-card">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>User:</strong> {order.user?.username}</p>
        <p><strong>Email:</strong> {order.user?.email}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p>
          <strong>Payment:</strong>{" "}
          <span className={order.isPaid ? "status-paid" : "status-pending"}>
            {order.isPaid ? "Paid" : "Not Paid"}
          </span>
        </p>
        <p>
          <strong>Delivery:</strong>{" "}
          <span className={order.isDelivered ? "status-paid" : "status-pending"}>
            {order.isDelivered ? "Delivered" : "Pending"}
          </span>
        </p>
      </div>

      {order.customizationRequest && (
        <div className="personalization-card">
          <h3>✨ Personalization Request</h3>

          <p className="personalization-subtitle">
            The customer requested the following customizations:
          </p>

          <div className="personalization-content">
            {order.customizationRequest}
          </div>
        </div>
      )}

      <h3>Items</h3>

      <div className="order-details-items">
        {order.orderItems.map((item, index) => (
          <div className="order-details-item" key={index}>
            <div>
              <h4>{item.name}</h4>
              <p>Qty: {item.qty}</p>
            </div>

            <div>
              <p>{item.price} ₪</p>
              <strong>{item.price * item.qty} ₪</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="order-details-total">
        <h3>Total: {order.totalPrice} ₪</h3>
      </div>
    </div>
  );
}

export default OrderDetailsPage;