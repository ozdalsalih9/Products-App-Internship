import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { imageDb } from './Config';
import { useNavigate } from 'react-router-dom';
import './UsersPanel.css'

const UsersPanel = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(product => 
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    getCategories();
    getProducts();
  }, [selectedCategory]);

  const getCategories = async () => {
    try {
      const response = await fetch("http://localhost:5144/api/products/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error occurred while fetching category data:", error);
    }
  };

  const getProducts = async () => {
    try {
      const url = selectedCategory
        ? `http://localhost:5144/api/products/categoryfilter?catId=${selectedCategory}`
        : "http://localhost:5144/api/products";
      const response = await fetch(url);
      const productsData = await response.json();

      const productsWithImages = await Promise.all(productsData.map(async (product) => {
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
      }));

      setProducts(productsWithImages);
    } catch (error) {
      console.error('Error occurred while fetching products:', error);
    }
  };

  const getImageUrl = async (productName) => {
    try {
      const imgRef = ref(imageDb, `files/${productName}`);
      const url = await getDownloadURL(imgRef);
      return url;
    } catch (error) {
      console.error('Error occurred while fetching image:', error);
      return null; 
    }
  };

  const addToFavorites = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5144/api/products/favorites/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ productId })
      });

      if (!response.ok) {
        throw new Error('Failed to add product to favorites.');
      }

      alert('Product added to favorites.');
    } catch (error) {
      console.error('Error occurred while adding to favorites:', error);
      alert('An error occurred while adding to favorites.');
    }
  };

  return (
    <>
      <div>
        <h2 className='prds'>Products</h2>
        <div className='search-container'>
      <h3 className='text-center'>Search</h3>
      <input
        type="text"
        placeholder="Search for a product..."
        value={searchTerm}
        
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      </div>
        <div className='categorySelect'>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className={`prods show`}>
          <table className="table table-bordered table-striped" id='tabloo'>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product ID</th>
                <th>Price</th>
                <th>Category</th>
                <th>Image</th>
                <th>Add to Favorites</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.productId}>
                  <td>{product.productName}</td>
                  <td>{product.productId}</td>
                  <td>{product.price} TL</td>
                  <td>{product.category}</td>
                  <td>
                    {product.imgUrl ? <img src={product.imgUrl} alt={product.productName} width="60" /> : 'No image'}
                  </td>
                  <td>
                    <button className='btn btn-primary' onClick={() => addToFavorites(product.productId)}>
                      Add
                    </button>
                  </td>
                  <td><button className='btn btn-dark' onClick={()=> navigate(`/product/details/${product.productId}`)}>Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default UsersPanel;
