import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

function WishlistPage() {
  const backendUrl = import.meta.env.VITE_API_URL.replace("/api", "");

  const { wishlistItems, removeItemFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t } = useTranslation();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(t("wishlistPage.addedToCart"));
  };

  return (
    <div className="wishlist-page">
      <h2>{t("wishlistPage.title")}</h2>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <p>{t("wishlistPage.empty")}</p>

          <Link to="/products" className="primary-btn">
            {t("wishlistPage.browseProducts")}
          </Link>
        </div>
      ) : (
        <div className="wishlist-list">
          {wishlistItems.map((product) => (
            <div className="wishlist-item" key={product._id}>
              <img
                src={
                  product.image.startsWith("/uploads")
                    ? `${backendUrl}${product.image}`
                    : product.image
                }
                alt={product.name}
              />

              <div className="wishlist-info">
                <h3>{product.name}</h3>
                <p>₪ {product.price}</p>
                <p>{product.category}</p>
              </div>

              <div className="wishlist-actions">
                <button onClick={() => handleAddToCart(product)}>
                  {t("wishlistPage.addToCart")}
                </button>

                <button
                  onClick={() => removeItemFromWishlist(product._id)}
                >
                  {t("wishlistPage.remove")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;