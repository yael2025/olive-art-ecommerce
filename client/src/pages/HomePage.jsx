import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";

function HomePage() {
  const { user, login, logout } = useUser();
  const { cartItems, addToCart } = useCart();

  return (
    <div>
      <h2>Home Page</h2>

      <button onClick={() => login({ name: "Yael", role: "user" })}>
        Login (fake)
      </button>

      <button onClick={logout}>Logout</button>

      <p>User: {user ? user.name : "Not logged in"}</p>

      <hr />

      <button onClick={() => addToCart({ name: "Menorah", price: 100 })}>
        Add to Cart
      </button>

      <p>Cart items: {cartItems.length}</p>
    </div>
  );
}

export default HomePage;