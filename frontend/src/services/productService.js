const API_URL = "http://localhost:3000";

const createProductFormData = (productData) => {
  const formData = new FormData();
  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("quantity", productData.quantity);
  formData.append("category", productData.category);

  if (productData.image) {
    formData.append("image", productData.image);
  }

  return formData;
};

// ✅ CREATE - Add a new product
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      body: createProductFormData(productData)
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
      body: createProductFormData(productData)
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
