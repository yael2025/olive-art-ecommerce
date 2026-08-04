import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    if (!savedCart) return [];

    try {
      const parsedCart = JSON.parse(savedCart);

      return parsedCart.filter(
        (item) =>
          item &&
          item.product &&
          typeof item.quantity === "number"
      );
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.product._id === product._id
      );
  
      if (existingItem) {
        if (existingItem.quantity >= product.countInStock) {
          return prev;
        }
  
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
  
      if (product.countInStock <= 0) {
        return prev;
      }
  
      return [...prev, { product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product._id !== productId) {
          return item;
        }
  
        if (item.quantity >= item.product.countInStock) {

          setMessage(
              `Only ${item.product.countInStock} units are available in stock.`
          );
      
          setTimeout(() => {
              setMessage("");
          }, 3000);
      
          return item;
      }
  
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product._id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}