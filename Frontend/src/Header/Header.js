import React from "react";
import "./Header.css";
import freebird from "./picture/freebird.png";
import home from "./picture/home.png";
import person from "./picture/person.png";
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
        <img src={home} alt="home-option" />
      </Link>

      <img src={person} alt="profile-option" />
    </div>
  </div>
);

export default Header;
