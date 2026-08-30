import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { useWishlist } from "../context/WishlistContext";
import { useUser } from "../context/UserContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function ProductCard({ product }) {
  const backendUrl = import.meta.env.VITE_API_URL.replace("/api", "");

  const { addToCart } = useCart();
  const { user } = useUser();
  const { t, i18n } = useTranslation();

  const isHebrew = i18n.language === "he";

  const productName =
    isHebrew && product.nameHe
      ? product.nameHe
      : product.name;

  const {
    addItemToWishlist,
    removeItemFromWishlist,
    isInWishlist,
  } = useWishlist();

  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    if (product.countInStock <= 0) {
      toast.error(t("productCard.outOfStock"));
      return;
    }

    addToCart(product);

    toast.success(
      t("productCard.addedToCart", {
        productName,
      })
    );
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <button
          className={`wishlist-btn ${inWishlist ? "active" : ""}`}
          onClick={async (e) => {
            e.preventDefault();

            if (!user) {
              toast.error(t("productCard.signInWishlist"));
              return;
            }

            try {
              if (inWishlist) {
                await removeItemFromWishlist(product._id);
                toast.success(t("productCard.removedFromWishlist"));
              } else {
                await addItemToWishlist(product._id);
                toast.success(t("productCard.addedToWishlist"));
              }
            } catch (error) {
              toast.error(
                error.response?.data?.message ||
                t("productCard.wishlistUpdateFailed")
              );
            }
          }}
        >
          {inWishlist ? <FaHeart /> : <FaRegHeart />}
        </button>

        {product.image ? (
          <img
            src={
              product.image.startsWith("/uploads")
                ? `${backendUrl}${product.image}`
                : product.image
            }
            alt={productName}
          />
        ) : (
          <div className="product-image-placeholder">
            {t("productCard.noImage")}
          </div>
        )}
      </div>

      <h3>{productName}</h3>

      <p>{product.price} ₪</p>

      <Link to={`/products/${product._id}`}>
        {t("productCard.viewDetails")}
      </Link>

      <br />
      <br />

      <button
        onClick={handleAddToCart}
        disabled={product.countInStock <= 0}
      >
        {product.countInStock <= 0
          ? t("productCard.outOfStock")
          : t("productCard.addToCart")}
      </button>
    </div>
  );
}

export default ProductCard;