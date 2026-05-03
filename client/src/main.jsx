import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <CartProvider>
        <App />
        <Toaster position="top-right" />
      </CartProvider>
    </UserProvider>
  </React.StrictMode>
);