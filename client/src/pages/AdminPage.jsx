import { useEffect, useState } from "react";
import api from "../services/api";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const [isUploadingImage, setIsUploadingImage] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    countInStock: "",
    category: "",
  });

  const { user } = useUser();
  const { t, i18n } = useTranslation();

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
    //console.log("FORM DATA BEFORE SAVE:", formData);

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, formData);
        toast.success(t("adminPage.productUpdated"));
      } else {
        await api.post("/products", formData);
        toast.success(t("adminPage.productCreated"));
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Save product failed", error);
      toast.error(t("adminPage.saveProductFailed"));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setIsUploadingImage(true);

    const toastId = toast.loading(
      t("adminPage.uploadingImage")
    );

    try {
      const imageUrl = await uploadImage(file);

      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      toast.success(
        t("adminPage.imageUploaded"),
        {
          id: toastId,
        }
      );
    } catch (error) {
      console.error(
        "IMAGE UPLOAD ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        t("adminPage.imageUploadFailed"),
        {
          id: toastId,
        }
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const editHandler = (product) => {
    setEditingProductId(product._id);
    setShowEditSection(true);

    setFormData({
      name: product.name || "",
      price: product.price ?? "",
      description: product.description || "",
      image: product.image || "",
      countInStock: product.countInStock ?? "",
      category: product.category || "",
    });
  };
  const deleteHandler = async (id) => {
    if (window.confirm(t("adminPage.confirmDeleteProduct"))) {
      try {
        await api.delete(`/products/${id}`);
        toast.success(t("adminPage.productDeleted"));
        fetchProducts();
      } catch (error) {
        console.error("Delete failed", error);
        toast.error(
          error.response?.data?.message || t("adminPage.deleteFailed ")
        );
        fetchProducts();
      }

    }
  }; setFormData
  const deliverHandler = async (id) => {
    try {
      await markOrderDelivered(id);
      fetchOrders();
      await markOrderDelivered(id);

      toast.success(t("adminPage.orderDelivered"));
    } catch (error) {
      console.error("Deliver failed", error);
      toast.error(t("adminPage.somethingWentWrong"));
    }
  };
  const payHandler = async (id) => {
    try {
      await markOrderPaid(id);
      fetchOrders();
      await markOrderPaid(id);
      toast.success(t("adminPage.orderMarkedPaid"));
    } catch (error) {
      console.error("Payment failed", error);
      toast.error(t("adminPage.somethingWentWrong"));
    }
  };
  const generateAIDescription = async () => {
    try {
      if (!formData.name || !formData.category) {
        toast.error(t("adminPage.enterNameAndCategory"));
        return;
      }
      toast.loading(t("adminPage.generatingDescription"), {
        id: "ai-description",
      });
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
      toast.success(t("adminPage.aiDescriptionGenerated"), {
        id: "ai-description",
      });
    } catch (error) {
      console.error(error);
      toast.error(t("adminPage.aiGenerationFailed"), {
        id: "ai-description",
      });
    }
  }

  const addCategoryHandler = async (e) => {
    e.preventDefault();

    try {
      if (!newCategoryName.trim()) {
        toast.error(t("adminPage.categoryNameRequired"));
        return;
      }

      await createCategory(newCategoryName.trim());

      toast.success(t("adminPage.categoryCreated"));
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Create category failed", error);
      toast.error(
        error.response?.data?.message ||
        t("adminPage.createCategoryFailed")
      );
    }
  };

  const deleteCategoryHandler = async (id) => {
    if (window.confirm(t("adminPage.confirmDeleteCategory"))) {
      try {
        await deleteCategory(id);

        toast.success(t("adminPage.categoryDeleted"));
        fetchCategories();
      } catch (error) {
        console.error("Delete category failed", error);
        toast.error(
          error.response?.data?.message ||
          t("adminPage.deleteCategoryFailed")
        );
      }
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="admin-page">
      <h2>{t("adminPage.title")}</h2>

      <div className="admin-sections">
        <div className="admin-section-card">
          <button
            className="admin-section-toggle"
            onClick={() => setShowAddSection((prev) => !prev)}
          >
            {showAddSection
              ? t("adminPage.hideAddProduct")
              : t("adminPage.addProduct")}
          </button>

          {showAddSection && (
            <div className="admin-section-content">
              <h3>{t("adminPage.addProduct")}</h3>

              <form className="admin-form" onSubmit={handleSubmit}>
                <input
                  name="name"
                  placeholder={t("adminPage.name")}
                  value={formData.name}
                  onChange={handleChange}
                />

                <input
                  name="price"
                  placeholder={t("adminPage.price")}
                  value={formData.price}
                  onChange={handleChange}
                />
                <label>{t("adminPage.description")}</label>

                <button
                  type="button"
                  onClick={generateAIDescription}
                >
                  ✨ {t("adminPage.generateAIDescription")}
                </button>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder={t("adminPage.description")}
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
                  <small>{t("adminPage.uploaded")} ✔</small>
                )}

                <input
                  name="countInStock"
                  placeholder={t("adminPage.stock")}
                  value={formData.countInStock}
                  onChange={handleChange}
                />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">
                    {t("adminPage.selectCategory")}
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category.name}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={isUploadingImage}
                >
                  {isUploadingImage
                    ? t("adminPage.uploadingImage")
                    : t("adminPage.addProduct")}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="admin-section-card">
          <button
            className="admin-section-toggle"
            onClick={() => setShowEditSection((prev) => !prev)}
          >
            {showEditSection
              ? t("adminPage.hideEditProduct")
              : t("adminPage.editProduct")}
          </button>

          {showEditSection && (
            <div className="admin-section-content">
              <h3>
                {editingProductId
                  ? t("adminPage.updateProduct")
                  : t("adminPage.chooseProductToEdit")}
              </h3>

              {editingProductId && (
                <form className="admin-form" onSubmit={handleSubmit}>
                  <input
                    name="name"
                    placeholder={t("adminPage.name")}
                    value={formData.name}
                    onChange={handleChange}
                  />

                  <input
                    name="price"
                    placeholder={t("adminPage.price")}
                    value={formData.price}
                    onChange={handleChange}
                  />

                  <textarea
                    name="description"
                    placeholder={t("adminPage.description")}
                    value={formData.description}
                    onChange={handleChange}
                    rows="8"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                  {formData.image && <small>Uploaded ✔</small>}

                  <input
                    name="countInStock"
                    placeholder={t("adminPage.stock")}
                    value={formData.countInStock}
                    onChange={handleChange}
                  />

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">
                      {t("adminPage.selectCategory")}
                    </option>

                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <div className="admin-form-actions">
                    <button
                      type="submit"
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage
                        ? t("adminPage.uploadingImage")
                        : t("adminPage.updateProduct")}
                    </button>
                    <button type="button" onClick={resetForm}>
                      {t("adminPage.cancelEdit")}
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

                    <button onClick={() => editHandler(product)}>
                      {t("adminPage.edit")}
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
            onClick={() => setShowDeleteSection((prev) => !prev)}
          >
            {showDeleteSection
              ? t("adminPage.hideDeleteProduct")
              : t("adminPage.deleteProduct")}
          </button>

          {showDeleteSection && (
            <div className="admin-section-content">
              <h3>{t("adminPage.deleteProduct")}</h3>

              <div className="admin-products-list">
                {products.map((product) => (
                  <div className="admin-product-row" key={product._id}>
                    <div>
                      <h4>{product.name}</h4>
                      <p>{product.price} ₪</p>
                    </div>

                    <button onClick={() => deleteHandler(product._id)}>
                      {t("adminPage.delete")}
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
            {showCategoriesSection
              ? t("adminPage.hideCategoryManagement")
              : t("adminPage.categoryManagement")}
          </button>

          {showCategoriesSection && (
            <div className="admin-section-content">
              <form className="admin-form" onSubmit={addCategoryHandler}>
                <input
                  type="text"
                  placeholder={t("adminPage.categoryName")}
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />

                <button type="submit">
                  {t("adminPage.addCategory")}
                </button>
              </form>

              <div className="admin-products-list">
                {categories.length === 0 ? (
                  <p>{t("adminPage.noCategories")}</p>
                ) : (
                  categories.map((category) => (
                    <div className="admin-product-row" key={category._id}>
                      <div>
                        <h4>{category.name}</h4>
                      </div>

                      <button onClick={() => deleteCategoryHandler(category._id)}>
                        {t("adminPage.delete")}
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
            {showOrdersSection
              ? t("adminPage.hideOrders")
              : t("adminPage.viewOrders")}
          </button>

          {showOrdersSection && (
            <div className="admin-section-content">
              <h3>{t("adminPage.allOrders")}</h3>
              {orders.length === 0 ? (
                <p>{t("adminPage.noOrders")}</p>
              ) : (
                <div className="admin-orders-list">
                  {orders.map((order) => (
                    <div className="admin-order-card" key={order._id}>
                      <div className="admin-order-header">
                        <span>
                          <strong>
                            {t("adminPage.orderNumber")} #{order._id.slice(-6)}
                          </strong>
                        </span>

                        <span>
                          <strong>{t("adminPage.total")}:</strong> ₪{order.totalPrice}
                        </span>
                      </div>

                      <p>
                        <strong>{t("adminPage.user")}:</strong> {order.user?.username}
                      </p>
                      <p>
                        <strong>{t("adminPage.date")}:</strong>{" "}
                        {new Date(order.createdAt).toLocaleDateString(
                          i18n.language === "he" ? "he-IL" : "en-US"
                        )}
                      </p>

                      <div className="admin-status">
                        <span className={order.isPaid ? "status paid" : "status not-paid"}>
                          {order.isPaid
                            ? t("adminPage.paid")
                            : t("adminPage.notPaid")}
                        </span>

                        <span
                          className={
                            order.isDelivered
                              ? "status delivered"
                              : "status pending"
                          }
                        >
                          {order.isDelivered
                            ? t("adminPage.delivered")
                            : t("adminPage.pending")}
                        </span>
                      </div>

                      <Link
                        to={`/orders/${order._id}`}
                        className="admin-order-details-link"
                      >
                        {t("adminPage.viewDetails")}
                      </Link>

                      <div className="admin-order-actions">
                        <button
                          onClick={() => payHandler(order._id)}
                          disabled={order.isPaid}
                        >
                          {t("adminPage.markAsPaid")}
                        </button>

                        <button
                          onClick={() => deliverHandler(order._id)}
                          disabled={!order.isPaid || order.isDelivered}
                        >
                          {t("adminPage.markAsDelivered")}
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