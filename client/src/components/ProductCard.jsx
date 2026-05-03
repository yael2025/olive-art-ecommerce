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
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
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