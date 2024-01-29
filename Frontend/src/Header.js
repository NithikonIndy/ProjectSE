// Header.js
import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import './Header.css';
import freebird from './picture/freebird.png';
import home from './picture/home.png';
import person from './picture/person.png';

const Header = () => (
  <div className="comment-page-header">
    <div className="comment-page-logo">
      {/* Insert your logo image here */}
      <Link to="/">
        <img src={freebird} alt="Logo" />
      </Link>
      <span className="title">
        <span className="free">Free</span>
      </span>
    </div>
    <div className="comment-page-search">
      <span className="bird">Bird</span>
    </div>
    <div className="comment-page-icons">
      <Link to="/home">
        <img src={home} alt="Home" />
      </Link>
      <img src={person} alt="Person" />
      {/* Insert icons here */}
    </div>
  </div>
);

export default Header;
