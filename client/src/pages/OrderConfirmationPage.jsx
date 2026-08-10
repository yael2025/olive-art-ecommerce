import "../styles/orderConfirmation.css";
import { useLocation, useNavigate } from "react-router-dom"
import { createOrder } from "../services/orderService"
import { useCart } from "../context/CartContext"
import toast from "react-hot-toast"

function OrderConfirmationPage() {

    const location = useLocation()
    const navigate = useNavigate()

    const { clearCart } = useCart()

    const orderData = location.state?.orderData

    if (!orderData) {
        return (
            <div className="payment-page">
                <h2>Order Error</h2>
                <p>No order data found.</p>
                <button onClick={() => navigate("/cart")}>
                    Back to Cart
                </button>
            </div>
        )
    }

    const confirmOrderHandler = async () => {
        try {
            await createOrder(orderData)

            clearCart()

            toast.success("Order submitted successfully")

            navigate("/my-orders")
        }
        catch (error) {
            console.error("Order submission failed", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to submit order"
            )
        }
    }

    return (
        <div className="order-confirmation-page">
          <div className="order-confirmation-card">
      
            <h2>Review Your Order</h2>
      
            <p className="order-confirmation-intro">
              Please review the details below before submitting your order.
            </p>
      
            <div className="order-confirmation-summary">
              <h3>Order Summary</h3>
      
              <div className="order-confirmation-row">
                <span>Items</span>
                <strong>{orderData.orderItems.length}</strong>
              </div>
      
              <div className="order-confirmation-row total">
                <span>Estimated Total</span>
                <strong>₪{orderData.totalPrice}</strong>
              </div>
      
              <p className="estimated-note">
              * Final price may vary depending on personalization requests and design complexity.
              </p>
            </div>
      
            {orderData.customizationRequest && (
              <div className="order-review-card">
                <h3>Personalization Request</h3>
      
                <div className="order-review-text">
                  {orderData.customizationRequest}
                </div>
      
                <p>
                  Your customization request will be reviewed before production and
                  may affect the final price.
                </p>
              </div>
            )}
      
            <div className="order-review-card">
              <h3>What Happens Next?</h3>
      
              <div className="next-step">
                <span>1</span>
                <p>
                  We review your order and personalization request.
                </p>
              </div>
      
              <div className="next-step">
                <span>2</span>
                <p>
                  If needed, we will contact you to confirm the final design and
                  pricing.
                </p>
              </div>
      
              <div className="next-step">
                <span>3</span>
                <p>
                  Once everything is confirmed, production begins and your order will
                  be prepared for delivery.
                </p>
              </div>
            </div>
      
            <button
              className="order-confirm-btn"
              onClick={confirmOrderHandler}
            >
              Submit Order
            </button>
      
            <button
              className="order-back-btn"
              onClick={() => navigate("/cart")}
            >
              Back to Cart
            </button>
      
          </div>
        </div>
      );
}

export default OrderConfirmationPage