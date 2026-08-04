import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const { cartItems } = useCart();
    const { user, logout } = useUser();
    const { wishlistItems } = useWishlist();

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const getGreeting = () => {
        const hour = new Date().getHours()

        if (hour >= 5 && hour < 12) return "Good Morning"
        if (hour >= 12 && hour < 18) return "Good Afternoon"
        if (hour >= 18 && hour < 21) return "Good Evening"

        return "Good Night"
    }

    return (
        <>
            {/* Top Bar */}
            <header className="topbar">
                <button className="menu-btn" onClick={() => setIsOpen(true)}>
                    ☰
                </button>
                <Link to="/" className="logo-container">
                    <img src="/images/logo.jpg" alt="logo" />
                    <h2>Olive Art Creations</h2>
                </Link>
                <div className="topbar-actions">
                    {user && (
                        <div className="topbar-greeting">
                            {getGreeting()}, {user.username}
                        </div>
                    )}

                    <Link to="/wishlist" className="wishlist-link">
                        <FaHeart />
                        {wishlistItems.length > 0 && (
                            <span className="wishlist-count">
                                {wishlistItems.length}
                            </span>
                        )}
                    </Link>
                    <Link to="/cart" className="topbar-cart">
                        🛒
                        {totalItems > 0 && (
                            <span className="topbar-cart-badge">{totalItems}</span>
                        )}
                    </Link>
                </div>
            </header>

            {/* Overlay */}
            {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <button className="close-btn" onClick={() => setIsOpen(false)}>
                    ✖
                </button>

                <nav>
                    {user && (
                        <span className="user-greeting">
                            {getGreeting()}, {user.username}
                        </span>
                    )}

                    <Link to="/" onClick={() => setIsOpen(false)}>
                        Home
                    </Link>

                    <Link to="/products" onClick={() => setIsOpen(false)}>
                        Products
                    </Link>

                    <Link to="/cart" onClick={() => setIsOpen(false)}>
                        Cart ({totalItems})
                    </Link>
                    {user && (
                        <Link to="/my-orders" onClick={() => setIsOpen(false)}>
                            Order History
                        </Link>
                    )}

                    {user?.role === "admin" && (
                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                            Admin
                        </Link>
                    )}
                    {(user?.role === "admin" || user?.role === "business_manager") && (
                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                            Dashboard
                        </Link>
                    )}

                    {user ? (
                        <button
                            onClick={() => {
                                logout();
                                setIsOpen(false);
                            }}
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                Sign In
                            </Link>

                            <Link to="/register" onClick={() => setIsOpen(false)}>
                                Sign Up
                            </Link>

                        </>

                    )}
                    <Link to="/about" onClick={() => setIsOpen(false)}>
                        About
                    </Link>
                    <Link to="/contact">Contact</Link>
                </nav>
            </div>
        </>
    );
}

export default Header;