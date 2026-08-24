import { useEffect, useState } from "react";
import { getProducts } from "../services/productsService";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const text = searchText.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(text) ||
      product.description?.toLowerCase().includes(text);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const price = Number(product.price);

    const matchesMinPrice =
      minPrice === "" || price >= Number(minPrice);

    const matchesMaxPrice =
      maxPrice === "" || price <= Number(maxPrice);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  return (
    <div>
      <h2>{t("productsPage.title")}</h2>

      <div className="products-filters">
        <input
          type="text"
          placeholder={t("productsPage.searchPlaceholder")}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "All"
                ? t("productsPage.allCategories")
                : category}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder={t("productsPage.minPrice")}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder={t("productsPage.maxPrice")}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p>{t("productsPage.noProducts")}</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsPage;