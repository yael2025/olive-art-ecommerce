import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "../context/CartContext";

const testProduct = {
    _id: "1",
    name: "Olive Wood Mezuzah",
    price: 120,
    countInStock: 5,
};

function CartTestComponent() {
    const { cartItems, addToCart, removeFromCart } = useCart();

    return (
        <div>
            <button onClick={() => addToCart(testProduct)}>
                Add Product
            </button>
            <button onClick={() => removeFromCart(testProduct._id)}>
                Remove Product
            </button>

            <span data-testid="cart-count">
                {cartItems.length}
            </span>

            {cartItems.length > 0 && (
                <>
                    <span>{cartItems[0].product.name}</span>
                    <span data-testid="quantity">
                        {cartItems[0].quantity}
                    </span>
                </>
            )}
        </div>
    );
}

describe("Shopping Cart", () => {

    // Frontend Test #2 - Add a product to the shopping cart
    // Verifies that addToCart adds the selected product with an initial quantity of 1.
    test("should add a product to the cart", async () => {
        localStorage.clear();

        const user = userEvent.setup();

        render(
            <CartProvider>
                <CartTestComponent />
            </CartProvider>
        );

        expect(screen.getByTestId("cart-count")).toHaveTextContent("0");

        await user.click(
            screen.getByRole("button", { name: "Add Product" })
        );

        expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
        expect(screen.getByText("Olive Wood Mezuzah")).toBeInTheDocument();
        expect(screen.getByTestId("quantity")).toHaveTextContent("1");
    });

    // Frontend Test #3 - Remove a product from the shopping cart
    // Verifies that removeFromCart removes the selected product from the cart.
    test("should remove a product from the cart", async () => {
        localStorage.clear();

        const user = userEvent.setup();

        render(
            <CartProvider>
                <CartTestComponent />
            </CartProvider>
        );

        // Add a product first
        await user.click(
            screen.getByRole("button", { name: "Add Product" })
        );

        expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
        expect(screen.getByText("Olive Wood Mezuzah")).toBeInTheDocument();

        // Remove the product
        await user.click(
            screen.getByRole("button", { name: "Remove Product" })
        );

        expect(screen.getByTestId("cart-count")).toHaveTextContent("0");

        expect(
            screen.queryByText("Olive Wood Mezuzah")
        ).not.toBeInTheDocument();
    });

});