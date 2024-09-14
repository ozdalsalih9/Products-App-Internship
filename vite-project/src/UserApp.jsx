import { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm/LoginForm'
import ShowPrds from './components/ShowPrds/ShowPrds';
import GetByID from './components/GetByID/GetByID';
import CreateProduct from './components/CreateProduct/CreateProduct';
import RegisterForm from './components/Register/Register';
import Header from './components/Header/Header';
import Logout from './components/Logout/Logout';
import { Routes, Route } from 'react-router-dom';
import ChangePassword from './components/ChangePassword/ChangePassword';
import 'bootstrap/dist/css/bootstrap.min.css';
import UsersPanel from './components/UsersPanel/UsersPanel';
import UserHeader from './components/UserHeader/UserHeader';
import './UserApp.css'
import Favorites from './components/Favorites/Favorites';
import Details from './components/Details/Details';
function UserApp() {
  const [isLoading, setIsLoading] = useState(false)


  return (
    <div id='UserApp'>
      
      
      <div>
      <UserHeader/>
        <Routes>
        <Route path='/uIndex' element={<UsersPanel/>}/>
        <Route path='/register' element={<RegisterForm/>}/>
        <Route path='/logout' element={<Logout/>}/>
        <Route path='/changepassword' element={<ChangePassword/>}/>
        <Route path='/login' element={<LoginForm/>}/>
        <Route path='/favorites' element={<Favorites/>}/>
        
        </Routes>
      </div>
      
      
      <br />
      <br />
      <br />
      <br />
      


      
    </div>
  );
}

export default UserApp;

