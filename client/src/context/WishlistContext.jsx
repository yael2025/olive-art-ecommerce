import { createContext, useContext, useEffect, useState } from "react";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} from "../services/wishlistService";
import { useUser } from "./UserContext";

const WishlistContext = createContext();
export const WishlistProvider = ({ children }) => {
    const { user } = useUser();
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        const loadWishlist = async () => {
            if (!user) {
                setWishlistItems([])
                return
            }
            try {
                const data = await getWishlist()
                setWishlistItems(data)
            }
            catch (error) {
                console.error("Failed to load wishlist", error);
            }
        }
        loadWishlist()
    }, [user])

    const addItemToWishlist = async (productId) => {
        const data = await addToWishlist(productId);
        setWishlistItems(data);
    };

    const removeItemFromWishlist = async (productId) => {
        const data = await removeFromWishlist(productId);
        setWishlistItems(data);
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some((item) => item._id === productId)
    }


    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addItemToWishlist,
                removeItemFromWishlist,
                isInWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    )
}

export const useWishlist = () => {
    return useContext(WishlistContext)
}
