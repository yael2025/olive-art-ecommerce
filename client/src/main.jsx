import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import { WishlistProvider } from "./context/WishlistContext";
import "./i18n"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
          <Toaster />
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
  </React.StrictMode>
);