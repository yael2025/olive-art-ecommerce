import { useEffect, useState } from "react";
import { getProducts } from "../services/productsService";
import ProductCard from "../components/ProductCard";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")  

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
    ...new Set(products.map((product)=> product.category).filter(Boolean)),
  ]

  const filteredProducts = products.filter((product)=>{
    const text = searchText.toLowerCase()

    const matchesSearch = 
      product.name.toLowerCase().includes(text) ||
      product.description?.toLowerCase().includes(text)

    const matchesCategory  = 
      selectedCategory ==="All" || product.category ===selectedCategory

    const price = Number(product.price)

    const matchesMinPrice = minPrice === "" || price >= Number(minPrice)

    const matchesMaxPrice  = maxPrice === "" || price <= Number(maxPrice)
    
    

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice

  })

  return (
    <div>
      <h2>Products</h2>

      <div className="products-filters">
        <input
         type="text" 
         placeholder="Search products..."
         value={searchText}
         onChange={(e)=> setSearchText(e.target.value)}
         />

         <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category)=>(
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input 
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
      </div>

      {filteredProducts.length===0 ?(
        <p>No products found</p>
      ):(
        <div className="products-grid">
          {filteredProducts.map((product)=>(
            <ProductCard key={product._id} product={product}/>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsPage;