import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useTranslation } from "react-i18next";

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const { t, i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);

        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    };

    const { cartItems } = useCart();
    const { user, logout } = useUser();
    const { wishlistItems } = useWishlist();

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) return t("header.goodMorning");
        if (hour >= 12 && hour < 18) return t("header.goodAfternoon");
        if (hour >= 18 && hour < 21) return t("header.goodEvening");

        return t("goodNight");
    };

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
                        {t("header.home")}
                    </Link>

                    <Link to="/products" onClick={() => setIsOpen(false)}>
                        {t("header.products")}
                    </Link>

                    <Link to="/cart" onClick={() => setIsOpen(false)}>
                        {t("header.cart")} ({totalItems})
                    </Link>
                    {user && (
                        <Link to="/my-orders" onClick={() => setIsOpen(false)}>
                            {t("header.orderHistory")}
                        </Link>
                    )}

                    {user?.role === "admin" && (
                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                            {t("header.admin")}
                        </Link>
                    )}
                    {(user?.role === "admin" || user?.role === "business_manager") && (
                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                            {t("header.dashboard")}
                        </Link>
                    )}

                    {user ? (
                        <button
                            onClick={() => {
                                logout();
                                setIsOpen(false);
                            }}
                        >
                            {t("header.logout")}
                        </button>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)}>
                                {t("header.signIn")}
                            </Link>

                            <Link to="/register" onClick={() => setIsOpen(false)}>
                                {t("header.signUp")}
                            </Link>
                        </>
                    )}
                    <Link to="/about" onClick={() => setIsOpen(false)}>
                        {t("header.about")}
                    </Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)}>
                        {t("header.contact")}
                    </Link>

                    <div className="language-switcher">
                        <button onClick={()=> changeLanguage("he")}>
                            עברית 
                        </button>

                        <button onClick={()=> changeLanguage("en")}>
                            English
                        </button>
                    </div>
                </nav>
            </div>
        </>
    );
}

export default Header;