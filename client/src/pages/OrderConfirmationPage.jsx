import "../styles/orderConfirmation.css";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { clearCart } = useCart();
  const { t } = useTranslation();

  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <div className="payment-page">
        <h2>{t("orderConfirmationPage.orderError")}</h2>
        <p>{t("orderConfirmationPage.noOrderData")}</p>

        <button onClick={() => navigate("/cart")}>
          {t("orderConfirmationPage.backToCart")}
        </button>
      </div>
    );
  }

  const confirmOrderHandler = async () => {
    try {
      await createOrder(orderData);

      clearCart();

      toast.success(
        t("orderConfirmationPage.orderSubmittedSuccessfully")
      );

      navigate("/my-orders");
    } catch (error) {
      console.error("Order submission failed", error);

      toast.error(
        error.response?.data?.message ||
          t("orderConfirmationPage.submitFailed")
      );
    }
  };

  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-card">

        <h2>{t("orderConfirmationPage.title")}</h2>

        <p className="order-confirmation-intro">
          {t("orderConfirmationPage.intro")}
        </p>

        <div className="order-confirmation-summary">
          <h3>{t("orderConfirmationPage.orderSummary")}</h3>

          <div className="order-confirmation-row">
            <span>{t("orderConfirmationPage.items")}</span>
            <strong>{orderData.orderItems.length}</strong>
          </div>

          <div className="order-confirmation-row total">
            <span>{t("orderConfirmationPage.estimatedTotal")}</span>
            <strong>₪{orderData.totalPrice}</strong>
          </div>

          <p className="estimated-note">
            {t("orderConfirmationPage.finalPriceNote")}
          </p>
        </div>

        {orderData.customizationRequest && (
          <div className="order-review-card">
            <h3>
              {t("orderConfirmationPage.personalizationRequest")}
            </h3>

            <div className="order-review-text">
              {orderData.customizationRequest}
            </div>

            <p>
              {t("orderConfirmationPage.personalizationNote")}
            </p>
          </div>
        )}

        <div className="order-review-card">
          <h3>{t("orderConfirmationPage.whatHappensNext")}</h3>

          <div className="next-step">
            <span>1</span>
            <p>{t("orderConfirmationPage.step1")}</p>
          </div>

          <div className="next-step">
            <span>2</span>
            <p>{t("orderConfirmationPage.step2")}</p>
          </div>

          <div className="next-step">
            <span>3</span>
            <p>{t("orderConfirmationPage.step3")}</p>
          </div>
        </div>

        <button
          className="order-confirm-btn"
          onClick={confirmOrderHandler}
        >
          {t("orderConfirmationPage.submitOrder")}
        </button>

        <button
          className="order-back-btn"
          onClick={() => navigate("/cart")}
        >
          {t("orderConfirmationPage.backToCart")}
        </button>

      </div>
    </div>
  );
}

export default OrderConfirmationPage;