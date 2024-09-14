import React, { useEffect, useState } from 'react';
import './GetUsers.css';
const GetUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5144/api/users");
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        setUsers(data);
      } catch (ex) {
        setError('Hata: ' + ex.message);
        console.error("HATA:", ex);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className='usersG' >
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2 className='text-center mt-7'>Users</h2>
      <table className='table table-bordered table-striped' id='usersTable'>
      <thead>
              <tr>
                <th>Name</th>
                <th>Mail</th>
                <th>User ID</th>
              </tr>
            </thead>
      <tbody>
        {users.map(user => (
         <tr>
          <td key={user.fullName}>{user.fullName}</td>
          <td key={user.email}>{user.email}</td>
          <td key={user.id}>{user.id}</td>
         </tr>
        ))}
      </tbody>
        
      </table>
      
      
    </div>
  );
}

export default GetUsers;
