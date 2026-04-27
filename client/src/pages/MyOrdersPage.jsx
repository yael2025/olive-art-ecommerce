import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";
import { Link } from "react-router-dom";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p className="empty-orders">No orders yet</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <div>
                  <h3>Order</h3>
                  <p className="order-id">{order._id}</p>
                </div>

                <div className="order-meta">
                  <p>Total: {order.totalPrice} ₪</p>
                  <p>
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="order-items">
                {order.orderItems.map((item, index) => (
                  <div className="order-item" key={index}>
                    <div className="order-item-info">
                      <Link to={`/orders/${order._id}`} className="details-link">
                        View Details
                      </Link>
                      <p className="item-name">{item.name}</p>
                      <p className="item-details">
                        Qty: {item.qty} | {item.price} ₪
                      </p>
                    </div>

                    <div className="item-total">
                      {item.qty * item.price} ₪
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;