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
  const [Reports,SetReports] = useState([]);
  const [show,Setshow] = useState([]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handlefetchreport = async () => {
    try {
      const response = await axios.get("https://backend-b1ep.onrender.com/returnreportReasons", {
      });
      const reverseReport=response.data.reverse();
        if (!reverseReport) {
            console.log("Not found");
        } else {
          SetReports(reverseReport);
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
    }
  };  

  const showreportblogBlogs = async () => {
    try {
      const response = await axios.get("https://backend-b1ep.onrender.com/api/blog");
      const reversedBlogs = response.data.blogs.reverse();
      

      SetBlogs(reversedBlogs);
      //console.log("Blogs:", reversedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const checkID = () => {
    handlefetchreport();
    showreportblogBlogs();
    // let lenofreport = Reports.length();
    // let lenofblog = Blogs.length();
    Blogs.forEach(blog => {
      Reports.forEach(report => {
        if(blog._id==report.postId){
          Setshow(blog);
        }
      });
    });
  

  }


  const handleDropdownClick = () => {
    toggleDropdown();
    checkID();
   
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
          {/* {Array.isArray(show) &&
          show.map((blog, index) => (
            <a >blog</a>

          ))} */}
           
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
