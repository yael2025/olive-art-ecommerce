import { useEffect, useState } from "react";
import api from "../services/api";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../services/orderService";
import { markOrderDelivered } from "../services/orderService";

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  const [orders, setOrders] = useState([]);
  const [showOrdersSection, setShowOrdersSection] = useState(false);

  const [showAddSection, setShowAddSection] = useState(false);
  const [showEditSection, setShowEditSection] = useState(false);
  const [showDeleteSection, setShowDeleteSection] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    countInStock: "",
    category: "",
  });

  const { user } = useUser();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (user === null) return;

    if (!user || !user.isAdmin) {
      navigate("/");
    } else {
      fetchProducts();
      fetchOrders();
    }
  }, [user, navigate]);

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
      } else {
        await api.post("/products", formData);
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Save product failed", error);
    }
  };

  const editHandler = (product) => {
    setEditingProductId(product._id);
    setShowEditSection(true);

    setFormData({
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
        fetchProducts();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };
  const deliverHandler = async (id) => {
    try {
      await markOrderDelivered(id);
      fetchOrders(); 
    } catch (error) {
      console.error("Deliver failed", error);
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

                <input
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                />

                <input
                  name="image"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={handleChange}
                />

                <input
                  name="countInStock"
                  placeholder="Stock"
                  value={formData.countInStock}
                  onChange={handleChange}
                />

                <input
                  name="category"
                  placeholder="Category"
                  value={formData.category}
                  onChange={handleChange}
                />

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
                    name="image"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={handleChange}
                  />

                  <input
                    name="countInStock"
                    placeholder="Stock"
                    value={formData.countInStock}
                    onChange={handleChange}
                  />

                  <input
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                  />

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
                      <div>
                        <p><strong>User:</strong> {order.user.username}</p>
                        <p><strong>Email:</strong> {order.user.email}</p>
                      </div>
                  
                      <div>
                        <p><strong>Total:</strong> {order.totalPrice} ₪</p>
                        <p>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                          Status:{" "}
                          {order.isDelivered ? (
                            <span style={{ color: "green" }}>Delivered</span>
                          ) : (
                            <span style={{ color: "red" }}>Pending</span>
                          )}
                        </p>
                      </div>
                    </div>
                  
                    <div className="admin-order-items">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="admin-order-item">
                          <p>{item.name}</p>
                          <p>Qty: {item.qty}</p>
                          <p>{item.price} ₪</p>
                        </div>
                      ))}
                    </div>
                  
                    {!order.isDelivered && (
                      <button
                        onClick={() => deliverHandler(order._id)}
                        style={{ marginTop: "10px" }}
                      >
                        Mark as Delivered
                      </button>
                    )}
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