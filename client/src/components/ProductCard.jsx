import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    //console.log("Button clicked - toast should appear");
    addToCart(product);

    toast.success(`${product.name} added to cart 🛒`);
    
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={`http://localhost:3001${product.image}`} 
          alt={product.name} />
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