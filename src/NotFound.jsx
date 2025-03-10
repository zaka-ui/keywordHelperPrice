// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './assets/css/main.css';
import NavBar from './components/NavBar';

const NotFound = () => {
  return (
    <div className="bg-gradient-to-l from-custom-blue to-custom-dark bg-[length:200%_100%] animate-gradient-x h-[100vh]">
      <NavBar />
      <div className="flex items-center flex-col justify-center h-[80%]">
        <h1 className='text-white text-4xl font-bold'>404 - Page Not Found</h1>
        <p className='mt-2 text-white'>Sorry, the page you're looking for doesn't exist.</p>
        <Link to="/" style={{ textDecoration: 'none', color: 'blue' }}>
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
