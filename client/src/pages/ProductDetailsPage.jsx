import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productsService";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

function ProductDetailsPage() {
  const backendUrl = import.meta.env.VITE_API_URL.replace("/api", "");
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const { t } = useTranslation();

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
    return <p>{t("productDetailsPage.loading")}</p>;
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
            <span>{t("productDetailsPage.noImage")}</span>
          )}
        </div>

        <div className="product-details-info">
          <h2>{product.name}</h2>
          <p className="product-category">{product.category}</p>
          <p className="product-description">{product.description}</p>

          <p className="product-price">{product.price} ₪</p>

          <p className="product-stock">
            {product.countInStock > 0
              ? t("productDetailsPage.inStock", {
                  count: product.countInStock,
                })
              : t("productDetailsPage.outOfStock")}
          </p>

          <button
            className="primary-btn"
            onClick={() => {
              addToCart(product);

              toast.success(
                t("productDetailsPage.addedToCart", {
                  productName: product.name,
                })
              );
            }}
            disabled={product.countInStock <= 0}
          >
            {t("productDetailsPage.addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;