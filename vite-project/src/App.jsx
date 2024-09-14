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
import GetUsers from './GetUsers/GetUsers';

function App() {


  return (
    <div id='App'>
      
      
      <div>
      <Header/>
        <Routes>
        <Route path='/users' element={<GetUsers/>}/>
        <Route path='/products' element={<ShowPrds/>}/>
        <Route path='/createproduct' element={<CreateProduct/>}/>
        <Route path='/logout' element={<Logout/>}/>
        </Routes>
        </div>
      
      
      


      
    </div>
  );
}

export default App;

