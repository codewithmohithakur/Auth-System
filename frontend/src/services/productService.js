const API_URL = "http://localhost:3000";

// ✅ CREATE - Add a new product
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create product");
    }

    return data.product;
  } catch (err) {
    console.error("Create product error:", err);
    throw err;
  }
};

// ✅ READ - Get all products
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }

    return data.products;
  } catch (err) {
    console.error("Fetch products error:", err);
    throw err;
  }
};

// ✅ READ - Get a single product by ID
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch product");
    }

    return data.product;
  } catch (err) {
    console.error("Fetch product error:", err);
    throw err;
  }
};

// ✅ UPDATE - Edit a product
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update product");
    }

    return data.product;
  } catch (err) {
    console.error("Update product error:", err);
    throw err;
  }
};

// ✅ DELETE - Remove a product
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete product");
    }

    return data.product;
  } catch (err) {
    console.error("Delete product error:", err);
    throw err;
  }
};
