import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const { cartItems } = useCart();
    const { user, logout } = useUser();

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
            </header>

            {/* Overlay */}
            {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <button className="close-btn" onClick={() => setIsOpen(false)}>
                    ✖
                </button>

                <nav>
                    {user && (<><span>Hello, {user.username}</span></>)}

                    <Link to="/" onClick={()=> setIsOpen(false)}>
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
                    {user && user.isAdmin && (
                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                            Admin
                        </Link>
                    )}
                    {user?.isAdmin && (
                        <Link to="/dashboard">
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
                </nav>
            </div>
        </>
    );
}

export default Header;