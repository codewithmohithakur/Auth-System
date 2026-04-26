import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
} from "../services/productService";
import "../styles/Products.css";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setError("");
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      
      if (editingId) {
        // Update existing product
        await updateProduct(editingId, formData);
        setSuccess("Product updated successfully!");
        setEditingId(null);

        setFormData({
          name: "",
          description: "",
          price: "",
          quantity: "",
          category: ""
        });

        setTimeout(() => {
          setSuccess("");
          fetchProducts();
        }, 2000);
      } else {
        // Create new product
        await createProduct(formData);
        setSuccess("Product created successfully!");

        setFormData({
          name: "",
          description: "",
          price: "",
          quantity: "",
          category: ""
        });

        await fetchProducts();
        navigate("/products");
      }

    } catch (err) {
      setError(err.message);
      console.error("Error saving product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category
    });
    setEditingId(product._id);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await deleteProduct(id);
        setSuccess("Product deleted successfully!");
        
        setTimeout(() => {
          setSuccess("");
          fetchProducts();
        }, 2000);

      } catch (err) {
        setError(err.message);
        console.error("Error deleting product:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: ""
    });
  };

  return (
    <div className="products-container">
      <h1>Product Management</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Add/Edit Product Form */}
      <div className="form-section">
        <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
        <form onSubmit={handleAddProduct}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Enter category"
              required
            />
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Processing..." : editingId ? "Update Product" : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products Display Section */}
      <div className="products-section">
        <h2>All Products ({products.length})</h2>

        {loading && <p className="loading">Loading products...</p>}

        {products.length === 0 && !loading ? (
          <p className="no-products">No products found. Add one to get started!</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <span className="product-category">{product.category}</span>
                </div>

                <p className="product-description">{product.description}</p>

                <div className="product-details">
                  <div className="detail">
                    <span className="label">Price:</span>
                    <span className="value">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Stock:</span>
                    <span className="value">{product.quantity} units</span>
                  </div>
                </div>

                <div className="product-actions">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="btn btn-edit"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="btn btn-delete"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
