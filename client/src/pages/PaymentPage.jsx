import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

function PaymentPage() {

    const location = useLocation()
    const navigate = useNavigate()

    const {clearCart} = useCart();

    const orderData = location.state?.orderData

    if (!orderData) {
        return (
            <div className="payment-page">
                <h2>Payment Error</h2>
                <p>No payment data found.</p>
                <button onClick={() => navigate("/cart")}>Back to cart</button>
            </div>
        )
    }
    

    const confirmPaymentHandler = async () => {
        try {
            await createOrder({
                ...orderData,
                isPaid: true,
            });

            clearCart();
            toast.success("Payment completed successfully");
            navigate("/my-orders");
        } catch (error) {
            console.error("Payment failed", error);
            toast.error(error.response?.data?.message || "Payment failed");
        }
    };

    return (
        <div className="payment-page">
            <div className="payment-card">
                <div className="payment-icon">🔒</div>

                <h2>Secure Payment Demo</h2>
                <p className="payment-warning">
                    Demo mode - no real payment will be processed.
                </p>

                <p className="payment-note">
                    Your credit card details are handled by an 🔐 Secure Payment Gateway
                    Sandbox Environment.
                    Olive Art Creations does not store any payment card information.
                </p>

                <div className="payment-provider-box">
                    <h3>External Payment Provider</h3>
                    <p>Secure sandbox payment simulation</p>
                    <p>No real credit card will be charged.</p>
                </div>

                <div className="payment-summary">
                    <h3>Payment Summary</h3>

                    <div className="payment-row">
                        <span>Items</span>
                        <strong>{orderData.orderItems.length}</strong>
                    </div>

                    <div className="payment-row total">
                        <span>Total Amount</span>
                        <strong>₪{orderData.totalPrice}</strong>
                    </div>
                </div>

                <button className="payment-confirm-btn" onClick={confirmPaymentHandler}>
                    Confirm Demo Payment
                </button>

                <button className="payment-back-btn" onClick={() => navigate("/cart")}>
                    Back to Cart
                </button>
            </div>
        </div>
    );
}

export default PaymentPage