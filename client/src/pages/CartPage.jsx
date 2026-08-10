import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const {
    cartItems,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const { user } = useUser();
  const navigate = useNavigate();

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
    shippingMethod: "Delivery"
  })
  const [customizationRequest, setCustomizationRequest] = useState("");

  const handleShippingChange = (e) => {
    setShippingDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
  const handleCustomizationChange = (e) => {
    setCustomizationRequest(e.target.value);
  };

  const checkoutHandler = async () => {
    if (!user) {
      setMessage("You must be logged in to place an order");
      return;
    }

    if (cartItems.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    if (
      !shippingDetails.fullName.trim() ||
      !shippingDetails.phone.trim() ||
      !shippingDetails.city.trim() ||
      !shippingDetails.address.trim() ||
      !shippingDetails.shippingMethod
    ) {
      setMessage("Please fill in all shipping details");
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
      setMessage(error.response?.data?.message || "Checkout failed");
    }
  };

  return (
    <div className="cart-page">
      <h2>Cart Page</h2>

      {message && <p>{message}</p>}

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-layout">
            <div className="cart-main">
              <div className="cart-list">
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.product._id}>
                    <div className="cart-item-info">
                      <div className="cart-item-image">
                        {item.product.image ? (
                          <img
                            src={
                              item.product.image.startsWith("/uploads")
                                ? `http://localhost:3001${item.product.image}`
                                : item.product.image
                            }
                            alt={item.product.name}
                          />
                        ) : (
                          <div className="cart-image-placeholder">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="cart-item-details">
                        <h3>{item.product.name}</h3>
                        <p>₪{item.product.price}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <button
                        onClick={() => increaseQuantity(item.product._id)}
                        disabled={item.quantity >= item.product.countInStock}
                      >
                        +
                      </button>

                      <button onClick={() => decreaseQuantity(item.product._id)}>
                        -
                      </button>

                      <button onClick={() => removeFromCart(item.product._id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="checkout-form">
                <h3>Shipping Details</h3>

                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={shippingDetails.fullName}
                  onChange={handleShippingChange}
                />

                <input
                  name="phone"
                  placeholder="Phone"
                  value={shippingDetails.phone}
                  onChange={handleShippingChange}
                />

                <input
                  name="city"
                  placeholder="City"
                  value={shippingDetails.city}
                  onChange={handleShippingChange}
                />

                <input
                  name="address"
                  placeholder="Address"
                  value={shippingDetails.address}
                  onChange={handleShippingChange}
                />

                <select name="shippingMethod"
                  value={shippingDetails.shippingMethod}
                  onChange={handleShippingChange}
                >
                  <option value="Delivery">Home Delivery</option>
                  <option value="Pickup">Pickup</option>
                </select>
              </div>

            </div>
            <div className="cart-summary">
              <h3>Total items: {totalItems}</h3>
              <h3>Total: {totalPrice} ₪</h3>
              <div className="customization-card">
                <h3>Customization Requests</h3>

                <p className="customization-text">
                  Tell us how you'd like to personalize your order.
                </p>

                <textarea
                  placeholder={`Examples:
                    • Engraving text
                    • Preferred epoxy color
                    • Gift wrapping
                    • Special dimensions
                    • Any other custom request`}
                  value={customizationRequest}
                  onChange={handleCustomizationChange}
                  rows={6}
                />
              </div>
              <button onClick={clearCart}>Clear Cart</button>
              <button onClick={checkoutHandler}>Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage