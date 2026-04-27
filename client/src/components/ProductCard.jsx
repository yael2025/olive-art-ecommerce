import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    // console.log("Added product:", product);
    // console.log("Cart after click:", cartItems);
  };

  return (
    <div className="product-card">
      <div className="product-image-placeholder">Image</div>

      <h3>{product.name}</h3>
      <p>{product.price} ₪</p>

      <div className="product-card-actions">
        <Link to={`/products/${product._id}`}>View Details</Link>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductCard;