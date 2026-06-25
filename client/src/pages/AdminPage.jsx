import { useEffect, useState } from "react";
import api from "../services/api";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";

import { getAllOrders } from "../services/orderService";
import { markOrderDelivered } from "../services/orderService";
import { markOrderPaid } from "../services/orderService";
import { generateDescription } from "../services/aiService";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../services/categoryService";
import { uploadImage } from "../services/uploadService";

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  const [orders, setOrders] = useState([]);
  const [showOrdersSection, setShowOrdersSection] = useState(false);

  const [showAddSection, setShowAddSection] = useState(false);
  const [showEditSection, setShowEditSection] = useState(false);
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [showCategoriesSection, setShowCategoriesSection] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");


  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    countInStock: "",
    category: "",
  });

  const { user } = useUser();


  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };
  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      image: "",
      countInStock: "",
      category: "",
    });
    setEditingProductId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, formData);
        toast.success("Product updated ✏️");
      } else {
        await api.post("/products", formData);
        toast.success("Product created successfully 🎉");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Save product failed", error);
      toast.error("Save product failed ❌");
    }
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const toastId = toast.loading("Uploading image...");

    try {
      const imageUrl = await uploadImage(file);

      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      toast.success("Image uploaded successfully", {
        id: toastId,
      });
    } catch (error) {
      console.error("Image upload failed", error);

      toast.error(error.response?.data?.message || "Image upload failed", {
        id: toastId,
      });
    }
  };
  const editHandler = (product) => {
    setEditingProductId(product._id);
    setShowEditSection(true);

    ({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      image: product.image || "",
      countInStock: product.countInStock || "",
      category: product.category || "",
    });
  };
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted 🗑️");
        fetchProducts();
      } catch (error) {
        console.error("Delete failed", error);
        toast.error(error.response?.data?.message || "Delete failed ❌");
        fetchProducts();
      }
    }
  }; setFormData
  const deliverHandler = async (id) => {
    try {
      await markOrderDelivered(id);
      fetchOrders();
      await markOrderDelivered(id);

      toast.success("Order delivered 🚚");
    } catch (error) {
      console.error("Deliver failed", error);
      toast.error("Something went wrong ❌");
    }
  };
  const payHandler = async (id) => {
    try {
      await markOrderPaid(id);
      fetchOrders();
      await markOrderPaid(id);
      toast.success("Order marked as paid 💰");
    } catch (error) {
      console.error("Payment failed", error);
      toast.error("Something went wrong ❌");
    }
  };
  const generateAIDescription = async () => {
    try {
      if (!formData.name || !formData.category) {
        toast.error("Please enter product name and category first")
        return
      }
      toast.loading("Generating description...", {
        id: "ai-description"
      })
      const description = await generateDescription(
        formData.name,
        formData.category
      )
      //console.log("Generated description:", description);

      setFormData((prev) => ({
        ...prev,
        description,
      }))
      setTimeout(() => {
        //console.log("formData after update:", document.querySelector('[name="description"]')?.value);
      }, 200);
      toast.success("AI description generated ✨", {
        id: "ai-description",
      })
    } catch (error) {
      console.error(error);
      toast.error("AI generation failed ❌", {
        id: "ai-description"
      })
    }
  }

  const addCategoryHandler = async (e) => {
    e.preventDefault();

    try {
      if (!newCategoryName.trim()) {
        toast.error("Category name is required");
        return;
      }

      await createCategory(newCategoryName.trim());

      toast.success("Category created successfully");
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Create category failed", error);
      toast.error(error.response?.data?.message || "Create category failed");
    }
  };

  const deleteCategoryHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);

        toast.success("Category deleted");
        fetchCategories();
      } catch (error) {
        console.error("Delete category failed", error);
        toast.error(error.response?.data?.message || "Delete category failed");
      }
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="admin-page">
      <h2>Admin Page</h2>

      <div className="admin-sections">
        <div className="admin-section-card">
          <button
            className="admin-section-toggle"
            onClick={() => setShowAddSection((prev) => !prev)}
          >
            {showAddSection ? "Hide Add Product" : "Add Product"}
          </button>

          {showAddSection && (
            <div className="admin-section-content">
              <h3>Add Product</h3>

              <form className="admin-form" onSubmit={handleSubmit}>
                <input
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <input
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                />
                <label>Description</label>

                <button
                  type="button"
                  onClick={generateAIDescription}
                >
                  ✨ Generate AI Description
                </button>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Description"
                />
                {/* <p>
                      Description length: {formData.description.length}
                    </p> */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {formData.image && (
                  <small>
                    Uploaded ✔
                  </small>
                )}

                <input
                  name="countInStock"
                  placeholder="Stock"
                  value={formData.countInStock}
                  onChange={handleChange}
                />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value=""> Select Category</option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={categories.name}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                <button type="submit">Add Product</button>
              </form>
            </div>
          )}
        </div>

        <div className="admin-section-card">
          <button
            className="admin-section-toggle"
            onClick={() => setShowEditSection((prev) => !prev)}
          >
            {showEditSection ? "Hide Edit Product" : "Edit Product"}
          </button>

          {showEditSection && (
            <div className="admin-section-content">
              <h3>{editingProductId ? "Update Product" : "Choose Product to Edit"}</h3>

              {editingProductId && (
                <form className="admin-form" onSubmit={handleSubmit}>
                  <input
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                  <input
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                  />

                  <input
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                  {formData.image && <small>Uploaded ✔</small>}

                  <input
                    name="countInStock"
                    placeholder="Stock"
                    value={formData.countInStock}
                    onChange={handleChange}
                  />

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>

                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <div className="admin-form-actions">
                    <button type="submit">Update Product</button>
                    <button type="button" onClick={resetForm}>
                      Cancel Edit
                    </button>
                  </div>
                </form>
              )}

              <div className="admin-products-list">
                {products.map((product) => (
                  <div className="admin-product-row" key={product._id}>
                    <div>
                      <h4>{product.name}</h4>
                      <p>{product.price} ₪</p>
                    </div>

                    <button onClick={() => editHandler(product)}>Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="admin-section-card">
          <button
            className="admin-section-toggle"
            onClick={() => setShowDeleteSection((prev) => !prev)}
          >
            {showDeleteSection ? "Hide Delete Product" : "Delete Product"}
          </button>

          {showDeleteSection && (
            <div className="admin-section-content">
              <h3>Delete Product</h3>

              <div className="admin-products-list">
                {products.map((product) => (
                  <div className="admin-product-row" key={product._id}>
                    <div>
                      <h4>{product.name}</h4>
                      <p>{product.price} ₪</p>
                    </div>

                    <button onClick={() => deleteHandler(product._id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="admin-section-card">
          <button
            className="admin-section-toggle"
            onClick={() => setShowCategoriesSection((prev) => !prev)}
          >
            {showCategoriesSection ? "Hide Category Management" : "Category Management"}
          </button>

          {showCategoriesSection && (
            <div className="admin-section-content">
              <form className="admin-form" onSubmit={addCategoryHandler}>
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />

                <button type="submit">Add Category</button>
              </form>

              <div className="admin-products-list">
                {categories.length === 0 ? (
                  <p>No categories</p>
                ) : (
                  categories.map((category) => (
                    <div className="admin-product-row" key={category._id}>
                      <div>
                        <h4>{category.name}</h4>
                      </div>

                      <button onClick={() => deleteCategoryHandler(category._id)}>
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="admin-section-card">
          <button
            className="admin-section-toggle"
            onClick={() => setShowOrdersSection((prev) => !prev)}
          >
            {showOrdersSection ? "Hide Orders" : "View Orders"}
          </button>

          {showOrdersSection && (
            <div className="admin-section-content">
              <h3>All Orders</h3>
              {orders.length === 0 ? (
                <p>No orders</p>
              ) : (
                <div className="admin-orders-list">
                  {orders.map((order) => (
                    <div className="admin-order-card" key={order._id}>
                      <div className="admin-order-header">
                        <span><strong>Order ID:</strong> {order._id.slice(-6)}</span>
                        <span><strong>Total:</strong> ₪{order.totalPrice}</span>
                      </div>

                      {/* 👤 USER */}
                      <p><strong>User:</strong> {order.user?.username}</p>

                      {/* 📦 SHIPPING */}
                      {order.shippingDetails && (
                        <div className="admin-shipping">
                          <p><strong>Name:</strong> {order.shippingDetails.fullName}</p>
                          <p><strong>City:</strong> {order.shippingDetails.city}</p>
                          <p><strong>Address:</strong> {order.shippingDetails.address}</p>
                        </div>
                      )}

                      {/* 📊 STATUS */}
                      <div className="admin-status">
                        <span className={order.isPaid ? "status paid" : "status not-paid"}>
                          {order.isPaid ? "Paid" : "Not Paid"}
                        </span>

                        <span className={order.isDelivered ? "status delivered" : "status pending"}>
                          {order.isDelivered ? "Delivered" : "Pending"}
                        </span>
                      </div>

                      {/* 🛒 ITEMS */}
                      <div className="admin-order-items">
                        {order.orderItems.map((item, i) => (
                          <div key={i} className="admin-order-item">
                            <span>{item.name}</span>
                            <span>{item.qty} × ₪{item.price}</span>
                          </div>
                        ))}
                      </div>

                      {/* 🎛 ACTIONS */}
                      <div className="admin-order-actions">
                        <button
                          onClick={() => payHandler(order._id)}
                          disabled={order.isPaid}
                        >
                          Mark as Paid
                        </button>

                        <button
                          onClick={() => deliverHandler(order._id)}
                          disabled={!order.isPaid || order.isDelivered}
                        >
                          Mark as Delivered
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;