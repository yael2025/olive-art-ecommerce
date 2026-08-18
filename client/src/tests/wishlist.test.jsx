import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import {
  WishlistProvider,
  useWishlist,
} from "../context/WishlistContext";

import {
  getWishlist,
  addToWishlist,
} from "../services/wishlistService";

import { useUser } from "../context/UserContext";

vi.mock("../services/wishlistService", () => ({
  getWishlist: vi.fn(),
  addToWishlist: vi.fn(),
  removeFromWishlist: vi.fn(),
}));

vi.mock("../context/UserContext", () => ({
  useUser: vi.fn(),
}));

const testProduct = {
  _id: "1",
  name: "Olive Wood Mezuzah",
  price: 120,
};

function WishlistTestComponent() {
  const {
    wishlistItems,
    addItemToWishlist,
    isInWishlist,
  } = useWishlist();

  return (
    <div>
      <button onClick={() => addItemToWishlist(testProduct._id)}>
        Add to Wishlist
      </button>

      <span data-testid="wishlist-count">
        {wishlistItems.length}
      </span>

      <span data-testid="wishlist-status">
        {isInWishlist(testProduct._id)
          ? "In Wishlist"
          : "Not In Wishlist"}
      </span>
    </div>
  );
}

describe("Wishlist", () => {

  beforeEach(() => {
    vi.clearAllMocks();

    useUser.mockReturnValue({
      user: {
        username: "Yael",
        email: "yael@test.com",
        role: "customer",
      },
    });
  });

  // Frontend Test #5 - Add a product to the wishlist
  // Verifies that adding a product updates the wishlist state
  // and identifies the product as part of the user's wishlist.
  test("should add a product to the wishlist", async () => {
    const existingProduct = {
      _id: "2",
      name: "Epoxy Menorah",
      price: 250,
    };

    getWishlist.mockResolvedValue([
      existingProduct,
    ]);

    addToWishlist.mockResolvedValue([
      existingProduct,
      testProduct,
    ]);

    const user = userEvent.setup();

    render(
      <WishlistProvider>
        <WishlistTestComponent />
      </WishlistProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("wishlist-count")
      ).toHaveTextContent("1");
    });

    expect(
      screen.getByTestId("wishlist-status")
    ).toHaveTextContent("Not In Wishlist");

    await user.click(
      screen.getByRole("button", {
        name: "Add to Wishlist",
      })
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("wishlist-count")
      ).toHaveTextContent("2");
    });

    expect(
      screen.getByTestId("wishlist-status")
    ).toHaveTextContent("In Wishlist");

    expect(addToWishlist).toHaveBeenCalledWith("1");
  });

});