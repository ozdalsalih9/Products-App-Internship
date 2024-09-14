import React, { useState, useEffect } from 'react';
import './CreateProduct.css';
import {imageDb} from './Config'
import {ref, uploadBytes } from 'firebase/storage'
const CreateProduct = () => {
  const [productName, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // State for loading status
  const [img, setImg] = useState("")
  const [category, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [details, setDetails] = useState("");


  // Fetch categories
  
  useEffect(()=>{
    const fetchCategories = async ()=> 
    {
      try{
        const response = await fetch("http://localhost:5144/api/products/categories")
        const data = await response.json()
        setCategories(data);
      }catch(error){
        console.error("Failed to fetch categories:", error);
      }
      
    }
      fetchCategories();
  },[])




  const handleClicks = ()=>
    {
       const imgRef = ref(imageDb, `files/${productName}`)
      uploadBytes(imgRef, img)
    }

  const create = async () => {
    setLoading(true); // Start loading status
    setSuccessMessage('');
    setErrorMessage('');

    const numericPrice = parseFloat(price);
    const token = (localStorage.getItem("token"));

    // 2-second delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const productData = {
      productName: productName,
      price: numericPrice,
      isActive: isActive,
      categoryId: selectedCategory,
      details: details
      
    };

    try {
      const response = await fetch('http://localhost:5144/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type':'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage("Product created successfully.");
      } else {
        const errorResult = await response.text();
        setErrorMessage("Failed to create product: " + errorResult);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to create product: " + error.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div id='create'>
      <div className='titlee'><h5>Create Product</h5></div>
      
      <hr />
      <br />
      <label htmlFor="productName">Product Name</label>
      <input className='mb-3'
        type="text"
        name="productName"
        value={productName}
        onChange={(e) => setName(e.target.value)}
        required
      />
      
      <label htmlFor="price">Price</label>
      <input className='price'
        type="number"
        name="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

<form>
      <label className='me-2' htmlFor="category">Category</label>
      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select a category</option>
        {category.map(category => (
          <option key={category.categoryId} value={category.categoryId}>
            {category.name}
          </option>
        ))}
      </select>
    </form>

      <label className='me-2' htmlFor="isActive">Active</label>
      <input
        type="checkbox"
        name="isActive"
        checked={isActive}
        onChange={(e) => setIsActive(e.target.checked)}
      />
      
      <br />
      <div className=''>  <label className='form-label' htmlFor="details">Product Details</label>
        <textarea name="details" className='form-control' value={details} onChange={(e) =>setDetails (e.target.value)}/>
</div>
      
      <input className='mb-2' type="file" onChange={(e)=>setImg(e.target.files[0])} />
      <button onClick={handleClicks}>Save Image</button>
      <div id='button'>
        <button type="button" onClick={create} disabled={loading}>
          {loading ? "Loading..." : "Save"}
        </button>
      </div>
      <br />
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default CreateProduct;
