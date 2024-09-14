import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { imageDb } from './Config';
import {jwtDecode} from 'jwt-decode'
import './Details.css';

const Details = () => {
  const { id } = useParams(); // URL'deki id parametresini almak için
  const [products, setProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  useEffect(() => {
    if (id) {
      getDetail(id);
      getComments(id);
    } else {
      console.error("No ID found in the URL.");
    }
  }, [id]);

  const getDetail = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5144/api/products/details/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error('API request failed with status:', response.status);
        return;
      }

      

      const productArray = await response.json();
      if (productArray && Array.isArray(productArray)) {
        const productsWithImages = await Promise.all(productArray.map(async (product) => {
          const imgUrl = await getImageUrl(product.productName); // Resim URL'sini al
          return { ...product, imgUrl }; // Ürüne imageUrl'i ekleyin
        }));
        setProducts(productsWithImages);
      } else {
        console.error('Product data is not an array');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const getImageUrl = async (productName) => {
    try {
      const imgRef = ref(imageDb, `files/${productName}`);
      const url = await getDownloadURL(imgRef);
      return url;
    } catch (error) {
      console.error('Resim getirilirken hata oluştu:', error);
      return null;
    }
  };

  const getComments = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5144/api/products/comment/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5144/api/products/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1, // Kullanıcı ID'sini buraya ekleyin
          productId: id,
          content: newComment,
        }),
      });
      setNewComment('');
      getComments(id); // Yorum ekledikten sonra yorumları yeniden getirin
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className='detail'>
      <div className='details'>
      <h1 className='title'>Product Details</h1>
      {products.length > 0 ? (
        products.map((product, index) => (
          <div key={index} className='infos'>
            <p className='fs-4'><strong> {product.productName}</strong></p>
            {product.imgUrl ? <img src={product.imgUrl} alt={product.productName} width={200} className='img'/> : 'Resim yok'}
            <p className='fs-5'><strong> {product.price}</strong> TL</p>
            <hr />
            <p className='fs-6'><strong>Details</strong></p>
            <p> {product.details}</p>
            
          </div>
        ))
      ) : (
        <p>No product details found.</p>
      )}
      </div>
      <div className='addcomment'>
        <h3>Add a Comment</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder='Write your comment here...'
        />
        <button onClick={handleAddComment}>Add Comment</button>
        </div>
      <div className='comments-section'>
        <h2>Comments</h2>
        <div className='comments'>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className='comment'>
              <p><strong>User</strong> {comment.userId}</p>
              <p>{comment.content}</p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
        </div>
       
      </div>
    </div>
  );
};

export default Details;
