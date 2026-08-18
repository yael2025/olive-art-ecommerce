import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";

import OrderConfirmationPage from "../pages/OrderConfirmationPage";
import { createOrder } from "../services/orderService";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

vi.mock("../services/orderService", () => ({
  createOrder: vi.fn(),
}));

vi.mock("../context/CartContext", () => ({
  useCart: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Order Confirmation", () => {

  // Frontend Test #6 - Submit an order successfully
  // Verifies that confirming an order sends the order data,
  // clears the shopping cart, displays a success message,
  // and redirects the user to the My Orders page.
  test("should submit the order successfully", async () => {
    const clearCart = vi.fn();

    useCart.mockReturnValue({
      clearCart,
    });

    createOrder.mockResolvedValue({
      _id: "order123",
    });

    const orderData = {
      orderItems: [
        {
          product: "product1",
          name: "Olive Wood Mezuzah",
          qty: 2,
          price: 120,
        },
      ],
      totalPrice: 240,
      shippingDetails: {
        fullName: "Yael Test",
        phone: "0500000000",
        city: "Test City",
        address: "Test Address 1",
        shippingMethod: "Home Delivery",
      },
      customizationRequest: "Personal engraving",
    };

    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/order-confirmation",
            state: {
              orderData,
            },
          },
        ]}
      >
        <Routes>
          <Route
            path="/order-confirmation"
            element={<OrderConfirmationPage />}
          />

          <Route
            path="/my-orders"
            element={<h1>My Orders Page</h1>}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Review Your Order")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Personal engraving")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Submit Order",
      })
    );

    expect(createOrder).toHaveBeenCalledWith(orderData);

    expect(clearCart).toHaveBeenCalled();

    expect(toast.success).toHaveBeenCalledWith(
      "Order submitted successfully"
    );

    expect(
      await screen.findByText("My Orders Page")
    ).toBeInTheDocument();
  });

});