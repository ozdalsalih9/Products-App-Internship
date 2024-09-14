import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Favorites.css';
import { getDownloadURL, ref } from 'firebase/storage';
import { imageDb } from './Config';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [imageUrls, setImageUrls] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5144/api/products/favorites', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setFavorites(data);
            fetchImageUrls(data); // Resim URL'lerini çek
        })
        .catch(error => console.error('Error fetching favorites:', error));
    }, []);

    const removeFromFavorites = (productId) => {
        fetch(`http://localhost:5144/api/products/favorites/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (response.ok) {
                setFavorites(favorites.filter(product => product.productId !== productId));
            } else {
                console.error('Failed to remove from favorites');
            }
        })
        .catch(error => console.error('Error removing from favorites:', error));
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

    const fetchImageUrls = async (products) => {
        const urls = {};
        for (let product of products) {
            const url = await getImageUrl(product.productName);
            if (url) {
                urls[product.productId] = url; // Resim URL'sini ürün kimliği ile eşleştir
            }
        }
        setImageUrls(urls); // Resim URL'lerini state'e kaydet
    };

    return (
        <div>
            <h2 className='text-center mt-5'>Favorites</h2>
            <table className="table table-bordered table-striped" id='tabloo'>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Product ID</th>
                        <th>Price</th>
                        <th>Category ID</th>
                        <th>Remove</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {favorites.map(product => (
                        <tr key={product.productId}>
                            <td>
                                {imageUrls[product.productId] ? (
                                    <img 
                                        src={imageUrls[product.productId]} 
                                        alt={product.productName} 
                                        style={{ width: '80px' }} 
                                    />
                                ) : (
                                    'Loading...'
                                )}
                            </td>
                            <td>{product.productName}</td>
                            <td>{product.productId}</td>
                            <td>{product.price} TL</td>
                            <td>{product.categoryId}</td>
                            <td>
                                <button 
                                    onClick={() => removeFromFavorites(product.productId)}
                                    className="btn btn-danger"
                                >
                                    Remove
                                </button>
                            </td>
                            <td>
                                <button className='btn btn-dark' onClick={() => navigate(`/product/details/${product.productId}`)}>Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Favorites;
