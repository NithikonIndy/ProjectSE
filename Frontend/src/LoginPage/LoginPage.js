import React from 'react';
import Header from './Header.js';
import './LoginPage.css'; // Make sure to create this CSS file with the styles provided below

const LoginPage = () => {
  return (
    <div className="login-page">
      <Header />
    
      <div className="login-content">
        <h1>CMU FreeBird</h1>
        <p>Anonymous Social For CPE</p>
        <button>Sign In With CMU Account</button>
      </div>
    </div>
  );
};

export default LoginPage;
