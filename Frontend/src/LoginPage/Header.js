import React from 'react';
import './Header.css';
import freebird from '../Header/picture/freebird.png';



const Header = () => (
    <div className="comment-page-header">
      <div className="comment-page-logo">
        {/* Insert your logo image here */}
        <img src={freebird} alt="Logo" />
          <span className="title">
            <span className="free">Free</span><span className="bird">Bird</span>
          </span>
      </div>

     
    </div>

);

export default Header;
