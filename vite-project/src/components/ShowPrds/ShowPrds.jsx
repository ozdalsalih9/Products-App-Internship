import React, { useEffect, useState } from 'react';
import './ShowPrds.css';
import { useNavigate } from 'react-router-dom';
import { imageDb } from './Config';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';

const ShowPrds = () => {
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [img, setImg] = useState(null); 
  const [categoryId, setCategory] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrelenmiş ürünler, ürün ismine göre filtre uygulanır.
  const filteredProducts = searchTerm
    ? products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products; // Eğer arama terimi yoksa tüm ürünler gösterilir.

  useEffect(() => {
    if (showProducts) {
      getProducts();
    }
    getCategories();
  }, [showProducts, selectedCategory]);

  const getCategories = async () => {
    try {
      const response = await fetch("http://localhost:5144/api/products/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getProducts = async () => {
    try {
      const url = selectedCategory
        ? `http://localhost:5144/api/products/categoryfilter?catId=${selectedCategory}`
        : "http://localhost:5144/api/products";
      const response = await fetch(url);
      const productsData = await response.json();

      const productsWithImages = await Promise.all(
        productsData.map(async (product) => {
          let category = "";

          if (product.categoryId === 1) {
            category = "Phone";
          } else if (product.categoryId === 2) {
            category = "Computer";
          } else {
            category = "Other";
          }

          const imgUrl = await getImageUrl(product.productName);
          return { ...product, category, imgUrl };
        })
      );

      setProducts(productsWithImages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getImageUrl = async (productName) => {
    try {
      const imgRef = ref(imageDb, `files/${productName}`);
      const url = await getDownloadURL(imgRef);
      return url;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  const handleClicks = async () => {
    if (img) {
      const imgRef = ref(imageDb, `files/${productName}`);

      try {
        const oldImgUrl = await getImageUrl(productName);
        if (oldImgUrl) {
          const oldImgRef = ref(imageDb, `files/${productName}`);
          await deleteObject(oldImgRef);
        }

        await uploadBytes(imgRef, img);
        setSuccessMessage("Image uploaded successfully.");
      } catch (error) {
        console.error("Error uploading image:", error);
        setErrorMessage("Error uploading image.");
      }
    }
  };

  const fetchProductDetails = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5144/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      setProductName(data.productName);
      setPrice(data.price);
      setIsActive(data.isActive);
      setCategory(data.categoryId);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const updateProduct = async () => {
    const token = localStorage.getItem("token");
    const updatedProduct = {
      productId,
      productName,
      price,
      isActive,
    };

    try {
      await handleClicks();

      const response = await fetch(`http://localhost:5144/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      await getProducts();
      setSuccessMessage("Product updated successfully.");
    } catch (error) {
      console.error("Error updating product:", error);
      setErrorMessage("Error updating product.");
    }
  };

  const handleProductIdChange = (e) => {
    const id = e.target.value;
    setProductId(id);
    if (id) {
      fetchProductDetails(id);
    }
  };

  const toggleProductsVisibility = () => {
    setShowProducts(!showProducts);
  };

  const deleteprd = async (id) => {
    const token = localStorage.getItem("token");
    const userConfirmed = window.confirm("Do you want to delete this product?");
    if (userConfirmed) {
      try {
        const response = await fetch(`http://localhost:5144/api/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }

        await getProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <>
      <h2 className="prds">Products</h2>
      <div className="search-container">
        <h3 className="text-center">Search</h3>
        <input
          type="text"
          placeholder="Search for a product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="categorySelect">
        <label htmlFor="category" className="m-2">
          Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="ShowPrds">
        <div>
          <div id="button">
            <button onClick={toggleProductsVisibility}>
              {showProducts ? "Hide Products" : "Show Products"}
            </button>
          </div>

          <div className={`prods ${showProducts ? "show" : ""}`}>
            <table className="table table-bordered table-striped" id="tabloo">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Product ID</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Image</th>
                  <th>Delete</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.productName || "No product name"}</td>
                    <td>{product.productId || "No product ID"}</td>
                    <td>{product.price ? `${product.price} TL` : "No price"}</td>
                    <td>{product.category || "No category"}</td>
                    <td>
                      {product.imgUrl ? (
                        <img
                          src={product.imgUrl}
                          alt={product.productName}
                          width="60"
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => deleteprd(product.productId)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-dark"
                        onClick={() =>
                          navigate(`/product/details/${product.productId}`)
                        }
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <br />

        <div id="Prds">
          <h5>Update Product</h5>
          <hr />
          <br />

          <input
            type="text"
            name='productId'
            value={productId}
            onChange={handleProductIdChange}
            placeholder="Enter Product ID" />
          <br />
          <input
            type="text"
            name='productName'
            value={productName}
            onChange={e => setProductName(e.target.value)}
            placeholder="Product Name" />
          <br />
          <input
            type="text"
            name='price'
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Price" />
          <br />
          <input type="file" onChange={(e) => setImg(e.target.files[0])} />
          <br />
          <input id='active'
            type="checkbox"
            name='isActive'
            checked={isActive}
            onChange={e => setIsActive(e.target.checked)} /> Active
          <div id='button22'>
            <br />
            <button onClick={updateProduct}>Save</button>
          </div>
          <br />
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
      </div>
    </>
  );
}

export default ShowPrds;
