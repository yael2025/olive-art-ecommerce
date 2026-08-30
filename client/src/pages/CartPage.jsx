import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CartPage() {
  const backendUrl = import.meta.env.VITE_API_URL.replace("/api", "");

  const {
    cartItems,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const { user } = useUser();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isHebrew = i18n.language === "he";

  const [message, setMessage] = useState("");

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    shippingMethod: "Delivery",
  });

  const [customizationRequest, setCustomizationRequest] = useState("");

  const handleShippingChange = (e) => {
    setShippingDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCustomizationChange = (e) => {
    setCustomizationRequest(e.target.value);
  };

  const checkoutHandler = async () => {
    if (!user) {
      setMessage(t("cartPage.mustBeLoggedIn"));
      return;
    }

    if (cartItems.length === 0) {
      setMessage(t("cartPage.emptyCart"));
      return;
    }

    if (
      !shippingDetails.fullName.trim() ||
      !shippingDetails.phone.trim() ||
      !shippingDetails.city.trim() ||
      !shippingDetails.address.trim() ||
      !shippingDetails.shippingMethod
    ) {
      setMessage(t("cartPage.fillShippingDetails"));
      return;
    }

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.product.name,
          qty: item.quantity,
          image: item.product.image || "",
          price: item.product.price,
          product: item.product._id,
          category: item.product.category,
        })),
        totalPrice,
        shippingDetails: {
          fullName: shippingDetails.fullName.trim(),
          phone: shippingDetails.phone.trim(),
          city: shippingDetails.city.trim(),
          address: shippingDetails.address.trim(),
          shippingMethod: shippingDetails.shippingMethod,
        },
        customizationRequest: customizationRequest.trim(),
      };

      navigate("/order-confirmation", {
        state: {
          orderData,
        },
      });
    } catch (error) {
      console.error("Checkout failed", error);
      setMessage(
        error.response?.data?.message || t("cartPage.checkoutFailed")
      );
    }
  };

  return (
    <div className="cart-page">
      <h2>{t("cartPage.title")}</h2>

      {message && <p>{message}</p>}

      {cartItems.length === 0 ? (
        <p>{t("cartPage.emptyCart")}</p>
      ) : (
        <div className="cart-layout">

          <div className="cart-main">

            <div className="cart-list">
              {cartItems.map((item) => {
                const productName =
                  isHebrew && item.product.nameHe
                    ? item.product.nameHe
                    : item.product.name;

                return (
                  <div className="cart-item" key={item.product._id}>

                    <div className="cart-item-info">

                      <div className="cart-item-image">
                        {item.product.image ? (
                          <img
                            src={
                              item.product.image.startsWith("/uploads")
                                ? `${backendUrl}${item.product.image}`
                                : item.product.image
                            }
                            alt={productName}
                          />
                        ) : (
                          <div className="cart-image-placeholder">
                            {t("cartPage.noImage")}
                          </div>
                        )}
                      </div>

                      <div className="cart-item-details">
                        <h3>{productName}</h3>

                        <p>₪{item.product.price}</p>

                        <p>
                          {t("cartPage.quantity")}: {item.quantity}
                        </p>
                      </div>

                    </div>

                    <div className="cart-item-actions">

                      <button
                        onClick={() =>
                          increaseQuantity(item.product._id)
                        }
                        disabled={
                          item.quantity >= item.product.countInStock
                        }
                      >
                        +
                      </button>

                      <button
                        onClick={() =>
                          decreaseQuantity(item.product._id)
                        }
                      >
                        -
                      </button>

                      <button
                        onClick={() =>
                          removeFromCart(item.product._id)
                        }
                      >
                        {t("cartPage.remove")}
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>

            <div className="checkout-form">
              <h3>{t("cartPage.shippingDetails")}</h3>

              <input
                name="fullName"
                placeholder={t("cartPage.fullName")}
                value={shippingDetails.fullName}
                onChange={handleShippingChange}
              />

              <input
                name="phone"
                placeholder={t("cartPage.phone")}
                value={shippingDetails.phone}
                onChange={handleShippingChange}
              />

              <input
                name="city"
                placeholder={t("cartPage.city")}
                value={shippingDetails.city}
                onChange={handleShippingChange}
              />

              <input
                name="address"
                placeholder={t("cartPage.address")}
                value={shippingDetails.address}
                onChange={handleShippingChange}
              />

              <select
                name="shippingMethod"
                value={shippingDetails.shippingMethod}
                onChange={handleShippingChange}
              >
                <option value="Delivery">
                  {t("cartPage.homeDelivery")}
                </option>

                <option value="Pickup">
                  {t("cartPage.pickup")}
                </option>
              </select>
            </div>

          </div>

          <div className="cart-summary">

            <h3>
              {t("cartPage.totalItems")}: {totalItems}
            </h3>

            <h3>
              {t("cartPage.total")}: {totalPrice} ₪
            </h3>

            <div className="customization-card">
              <h3>{t("cartPage.customizationRequests")}</h3>

              <p className="customization-text">
                {t("cartPage.customizationText")}
              </p>

              <textarea
                placeholder={t(
                  "cartPage.customizationPlaceholder"
                )}
                value={customizationRequest}
                onChange={handleCustomizationChange}
                rows={6}
              />
            </div>

            <button onClick={clearCart}>
              {t("cartPage.clearCart")}
            </button>

            <button onClick={checkoutHandler}>
              {t("cartPage.checkout")}
            </button>

          </div>

        </div>
      )}
    </div>
  );
}

export default CartPage;