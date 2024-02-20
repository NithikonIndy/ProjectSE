import React, { useState } from "react";
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
import axios from "axios";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [Blogs, SetBlogs] = useState([]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handlefetchreport = async () => {
    try {
      const response = await axios.get("https://backend-b1ep.onrender.com/returnreportReasons", {
      });
        if (!response.data) {
            console.log("Not found");
        } else {
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
    }
  };  

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("https://backend-b1ep.onrender.com/api/blog");
      const reversedBlogs = response.data.blogs.reverse();
 
      SetBlogs(reversedBlogs);
      //console.log("Blogs:", reversedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };


  const handleDropdownClick = () => {
    toggleDropdown();
    handlefetchreport();
  };

  return (
    <div className="header">
      <div className="container-logo">
        <span className="free">Free</span>
        <span className="bird">Bird</span>
      </div>

      <div className="container-search">
        <input type="text" placeholder="Search..." />
      </div>

      <div className="container-icons">
         
         
        {/* Dropdown component */}
        <div className={`dropdown ${isDropdownOpen ? "show" : ""}`}>
          <button onClick={handleDropdownClick} className="dropbtn">
            {/* Bell icon */}
          <FontAwesomeIcon icon={faBell} alt="notify-icon" />
          </button>
          <div id="myDropdown" className="dropdown-content">
            <a >Link 1</a>
            <a >Link 2</a>
            <a >Link 3</a>
          </div>
        </div>

       

        {/* Home icon */}
        <Link to="/home">
          <FontAwesomeIcon icon={faHome} alt="home-icon" />
        </Link>

        {/* User icon */}
        <Link to="/profile">
          <FontAwesomeIcon icon={faUser} alt="profile-icon" />
        </Link>

        {/* Logout icon */}
        <Link to="http://localhost:3000/logout">
          <FontAwesomeIcon icon={faRightFromBracket} alt="logout-icon" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
