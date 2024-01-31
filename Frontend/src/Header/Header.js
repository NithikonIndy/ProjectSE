import React from "react";
import "./Header.css";
import freebird from "./picture/freebird.png";
import home from "./picture/home.png";
import person from "./picture/person.png";
import notify from "./picture/notify.png";
import { Link } from "react-router-dom";


const Header = () => (
  <div className="header">
    <div className="container-logo">
      <img src={freebird} alt="Logo" />
      <span className="free">Free</span>
      <span className="bird">Bird</span>
    </div>

    <div className="container-search">
      <input type="text" placeholder="Search..." />
    </div>

    <div className="container-icons">
      <Link to="/home">
        <img src={notify} alt="home-option" />
      </Link>

      <Link to="/home">
        <img src={home} alt="home-option" />
      </Link>

      <Link to="/profile">
        <img src={person} alt="profile-option" />
      </Link>
    </div>
  </div>
);

export default Header;
