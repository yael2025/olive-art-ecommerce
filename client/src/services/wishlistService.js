import api from "./api";

export const getWishlist = async () => {
    const { data } = await api.get("/users/wishlist");
    return data;
};

export const addToWishlist = async (productId) => {
    const { data } = await api.post(`/users/wishlist/${productId}`);
    return data;
};

export const removeFromWishlist = async (productId) => {
    const { data } = await api.delete(`/users/wishlist/${productId}`);
    return data;
};