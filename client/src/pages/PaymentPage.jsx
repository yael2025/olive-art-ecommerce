import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

function PaymentPage() {

    const location = useLocation()
    const navigate = useNavigate()

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
    const { clearCart } = useCart();

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
                <h2>Secure Payment Demo</h2>

                <p className="payment-note">
                    For security reasons, credit card details are handled by an external
                    payment provider and are not stored in Olive Art Creations.
                </p>


                <div className="payment-summery">
                    <h3>Payment Summery</h3>
                    <p>Total: ₪{orderData.totalPrice}</p>
                    <p>Items: {orderData.orderItems.length}</p>
                </div>

                <div className="fake-provider-box">
                    <h3>External Payment Provider</h3>
                    <p>This is a secure sandbox payment simulation.</p>
                    <p>No real credit card is charged.</p>
                </div>

                <button className="primery-btn" onClick={confirmPaymentHandler}>
                    Confirm Demo Payment
                </button>
            </div>
        </div>
    )
}

export default PaymentPage