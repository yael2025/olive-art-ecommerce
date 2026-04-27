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

  const checkoutHandler = async () => {
    if (!user) {
      setMessage("You must be logged in to place an order");
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
        })),
        totalPrice,
      };

      await createOrder(orderData);

      clearCart();
      setMessage("Order created successfully!");
      navigate("/");
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
          <div className="cart-list">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.product._id}>
                <div>
                  <h3>{item.product.name}</h3>
                  <p>{item.product.price} ₪</p>
                  <p>Quantity: {item.quantity}</p>
                </div>

                <div className="cart-item-actions">
                  <button onClick={() => increaseQuantity(item.product._id)}>
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

          <div className="cart-summary">
            <h3>Total items: {totalItems}</h3>
            <h3>Total: {totalPrice} ₪</h3>
            <button onClick={clearCart}>Clear Cart</button>
            <button onClick={checkoutHandler}>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage