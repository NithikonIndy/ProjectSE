import React from "react";
import "./Header.css";
import freebird from "./picture/freebird.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faHome,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => (
  <div className="header">
    <div className="container-logo">
      <span className="free">Free</span>
      <span className="bird">Bird</span>
    </div>

    <div className="container-search">
      <input type="text" placeholder="Search..." />
    </div>

    <div className="container-icons">
      <Link to="/home">
        <FontAwesomeIcon icon={faBell} alt="notify-icon" />
      </Link>

      <Link to="/home">
        <FontAwesomeIcon icon={faHome} alt="home-icon" />
      </Link>

      <Link to="/profile">
        <FontAwesomeIcon icon={faUser} alt="profile-icon" />
      </Link>

      <Link to="http://localhost:3000/logout">
        <FontAwesomeIcon icon={faRightFromBracket} alt="logout-icon" />
      </Link>
    </div>
  </div>
);

export default Header;
