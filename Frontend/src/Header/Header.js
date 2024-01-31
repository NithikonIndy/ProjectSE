import React from 'react';
import './Header.css';
import freebird from './picture/freebird.png';
import home from './picture/home.png';
import person from './picture/person.png';


const Header = () => (
    <div className="comment-page-header">
      <div className="comment-page-logo">
        {/* Insert your logo image here */}
        <img src={freebird} alt="Logo" />
          <span className="title">  
            <span className="free">Free</span><span className="bird">Bird</span>
          </span>
      </div>
      <div className="comment-page-search">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="comment-page-icons">
        <img src={home} alt="Logo" />
        <img src={person} alt="Logo" />
        {/* Insert icons here */}
      </div>
    </div>

);

export default Header;
