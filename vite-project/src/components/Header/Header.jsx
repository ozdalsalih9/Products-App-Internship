import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'
const Header = () => {
  return (
    
    <div className='AdminHeader'>
      <p>admin</p>
        <div className='title2'><h5>ProductsApp</h5>
        </div>
        
        
        <Link className='Link'to='/admin/products' >Products</Link>
        <Link className='Link' to='/admin/CreateProduct'>Create Product</Link>
        <Link className='Link' to='/admin/users'>Users</Link>
        <Link className='Link' to='/admin/logout'>Logout</Link>

        




    </div>
  )
}

export default Header