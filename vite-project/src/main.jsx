import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import UserApp from './UserApp.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm/LoginForm.jsx';
import Details from './components/Details/Details.jsx';
import GetByID from './components/GetByID/GetByID.jsx';
import RegisterForm from './components/Register/Register.jsx';
import ChangePassword from './components/ChangePassword/ChangePassword.jsx';
const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/changepassword' element={<ChangePassword/>}/>
      <Route path='/register' element={<RegisterForm/>}/>
      <Route path='/product/details/:id' element={<Details/>}/>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/admin/*" element={<App />} />
      <Route path="/user/*" element={<UserApp />} />
      <Route path="/" element={<LoginForm />} /> 
    </Routes>
  </BrowserRouter>
);
