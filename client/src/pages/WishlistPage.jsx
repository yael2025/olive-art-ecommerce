import { Link } from "react-router-dom"
import { useWishlist } from "../context/WishlistContext"
import { useCart } from "../context/CartContext"
import toast from "react-hot-toast"


function WishlistPage() {
    const { wishlistItems, removeItemFromWishlist } = useWishlist()
    const { addToCart } = useCart()

    const handleAddToCart  = (product) => {
        addToCart(product)
        toast.success("Product added to cart")
    }

    return (

        <div className="wishlist-page">
            <h2>My Wishlist</h2>

            {wishlistItems.length === 0 ? (
                <div className="empty-wishlist">
                    <p>Your wishlist is empty.</p>
                    <Link to={"/product"} className="primary-btn">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="wishlist-list">
                    {wishlistItems.map((product) => (
                        <div className="wishlist-item" key={product._id}>
                            <img
                                src={`http://localhost:3001${product.image}`}
                                alt={product.name}
                            />

                            <div className="wishlist-info">
                                <h3>{product.name}</h3>
                                <p>₪ {product.price}</p>
                                <p>{product.category}</p>
                            </div>

                            <div className="wishlist-actions">
                                <button onClick={() => handleAddToCart(product)}>
                                    Add To Cart
                                </button>

                                <button onClick={() => removeItemFromWishlist(product._id)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default WishlistPage