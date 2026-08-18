import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ProductsPage from "../pages/ProductsPage";
import { getProducts } from "../services/productsService";

vi.mock("../services/productsService", () => ({
  getProducts: vi.fn(),
}));
vi.mock("../components/ProductCard", () => ({
  default: ({ product }) => (
    <div data-testid="product-card">
      <h3>{product.name}</h3>
      <p>{product.price} ₪</p>
    </div>
  ),
}));

describe("Products Page", () => {

  // Frontend Test #1 - Display products received from the service
  // Verifies that products returned by getProducts are rendered on the page.
  test("should display products successfully", async () => {
    getProducts.mockResolvedValue([
      {
        _id: "1",
        name: "Olive Wood Mezuzah",
        price: 120,
        description: "Handmade mezuzah",
        category: "Mezuzah",
      },
      {
        _id: "2",
        name: "Epoxy Menorah",
        price: 250,
        description: "Decorative menorah",
        category: "Menorah",
      },
    ]);

    render(<ProductsPage />);

    expect(
      await screen.findByText("Olive Wood Mezuzah")
    ).toBeInTheDocument();

    expect(
      await screen.findByText("Epoxy Menorah")
    ).toBeInTheDocument();
  });

});