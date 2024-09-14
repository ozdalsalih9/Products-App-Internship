import React from 'react'
import { Link } from 'react-router-dom'
import './UserHeader.css'
const UserHeader = () => {
  return (
    <div className='userHeader'>
        <div className='title2'><h5>ProductsApp   |</h5></div>
        <Link className='Link2'to='/user/uIndex' >Home</Link>
        <Link className='Link2' to='/user/favorites'>Favorites</Link>
        <Link className='Link2'to='/user/register' >Register</Link>
        <Link className='Link2' to='/user/logout'>Logout</Link>
        
        

    </div>
  )
}

export default UserHeader