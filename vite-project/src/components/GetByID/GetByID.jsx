import React, { useState } from 'react';

const GetByID = () => {
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [isActive, setIsActive] = useState(false);

  const getProductById = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const response = await fetch(`http://localhost:5144/api/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const product = await response.json();

    // Ürün bilgilerini state'lere atıyoruz
    setProductName(product.productName);
    setPrice(product.price);
    setIsActive(product.isActive);
  };

  return (
    <div id='getbyid'>
      <label htmlFor="productId">Ürün ID:</label>
      <input 
        type="text" 
        name="productId" 
        value={productId} 
        onChange={(e) => setProductId(e.target.value)} 
      />
      <div id='button'>
        <button onClick={getProductById}>Ürün Id Getir</button>
      </div>

      {/* Ürün bilgilerini ekranda gösteriyoruz */}
      {productName && (
        <div>
          <h3>Ürün Adı: {productName}</h3>
          <p>Fiyat: {price} TL</p>
          <p>Durum: {isActive ? 'Aktif' : 'Pasif'}</p>
        </div>
      )}
    </div>
  );
}

export default GetByID;
