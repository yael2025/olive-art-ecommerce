import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { useWishlist } from "../context/WishlistContext"
import { useUser } from "../context/UserContext"
import { FaHeart, FaRegHeart } from "react-icons/fa";


function ProductCard({ product }) {
  const backendUrl = import.meta.env.VITE_API_URL.replace("/api", "");

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    //console.log("Button clicked - toast should appear");
    addToCart(product);

    toast.success(`${product.name} added to cart 🛒`);

  };

  const { user } = useUser()

  const {
    addItemToWishlist,
    removeItemFromWishlist,
    isInWishlist
  } = useWishlist()
  const inWishlist = isInWishlist(product._id)
  //console.log(product.name, product._id, inWishlist);

  return (
    <div className="product-card">
      <div className="product-image">
        <button
          className={`wishlist-btn ${inWishlist ? "active" : ""}`}
          onClick={async (e) => {
            e.preventDefault();
            if (!user) {
              toast.error("Please sign in to use wishlist");
              return;
            }
            try {
              if (inWishlist) {
                await removeItemFromWishlist(product._id);
                toast.success("Removed from wishlist");
              } else {
                await addItemToWishlist(product._id);
                toast.success("Added to wishlist ❤️");
              }
            } catch (error) {
              toast.error(error.response?.data?.message || "Wishlist update failed");
            }
          }}
        >
          {inWishlist ? <FaHeart /> : <FaRegHeart />}
        </button>
        {product.image ? (
          <img
            src={`${backendUrl}${product.image}`}
            alt={product.name}
          />
        ) : (
          <div className="product-image-placeholder">No Image</div>
        )}
      </div>

      <h3>{product.name}</h3>

      <p>{product.price} ₪</p>

      <Link to={`/products/${product._id}`}>View Details</Link>

      <br /><br />

      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;