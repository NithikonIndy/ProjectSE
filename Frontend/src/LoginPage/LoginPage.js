import React from 'react';
import Header from "./Header.js";
import "./LoginPage.css";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="login-page">
      <Header />

      <div className="login-content" >
        <h1>CMU FreeBird</h1>
        <p>Anonymous Social For CPE</p>
        <Link to="https://backend-b1ep.onrender.com/user/signIn">
          <button>Sign In With CMU Account</button>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
