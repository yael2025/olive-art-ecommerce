import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";
import ProtectedRoute from "../components/ProtectedRoute";
import { useUser } from "../context/UserContext";

vi.mock("../context/UserContext", () => ({
  useUser: vi.fn(),
}));

describe("Protected Routes", () => {

  // Frontend Test #4 - Prevent a customer from accessing an admin route
  // Verifies that a logged-in customer without the admin role is redirected
  // to the home page when attempting to access an admin-only route.
  test("should redirect a customer away from the admin route", async () => {

    useUser.mockReturnValue({
      user: {
        username: "Yael",
        email: "yael@test.com",
        role: "customer",
        isAdmin: false,
      },
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <h1>Admin Page</h1>
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={<h1>Home Page</h1>}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Home Page")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Admin Page")
    ).not.toBeInTheDocument();
  });

});