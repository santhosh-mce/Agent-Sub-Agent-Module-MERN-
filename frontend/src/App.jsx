import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const isAuth = !!localStorage.getItem('token');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;