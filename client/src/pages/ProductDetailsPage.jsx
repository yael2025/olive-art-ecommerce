import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productsService";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

function ProductDetailsPage() {
  const backendUrl = import.meta.env.VITE_API_URL.replace("/api", "");
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="product-details-page">
      <div className="product-details-card">
        <div className="product-details-image">
          {product.image ? (
            <img
              src={
                product.image.startsWith("/uploads")
                  ? `${backendUrl}${product.image}`
                  : product.image
              }
              alt={product.name}
            />
          ) : (
            <span>No Image</span>
          )}
        </div>

        <div className="product-details-info">
          <h2>{product.name}</h2>
          <p className="product-category">{product.category}</p>
          <p className="product-description">{product.description}</p>

          <p className="product-price">{product.price} ₪</p>

          <p className="product-stock">
            {product.countInStock > 0
              ? `In stock: ${product.countInStock}`
              : "Out of stock"}
          </p>

          <button
            className="primary-btn"
            onClick={() => {
              addToCart(product);
              toast.success(`${product.name} added to cart 🛒`);
            }}
            disabled={product.countInStock <= 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;