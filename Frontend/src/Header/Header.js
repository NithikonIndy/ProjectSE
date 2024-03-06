import React, { useState, useEffect } from "react";
import _ from 'lodash';
import "./Header.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faHome,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useLocation, redirect, useNavigate } from "react-router-dom";
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

const items = [

  {
    label: <a href="https://www.antgroup.com">1st menu item1st menu item1st menu item1st menu item </a>,
    key: '0',
  },
  {
    label: <a href="https://www.aliyun.com">2nd menu item</a>,
    key: '1',
  },
  
  ,
  {
    label: '3rd menu item',
    key: '3',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
  {
    label: '3rd menu item',
    key: '3',
  },

    
];

const Header = (props) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [Blogs, SetBlogs] = useState([]);
  const [Reports, SetReports] = useState([]);
  const [Show, Setshow] = useState([]);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [seaechDescription, setSeaechDescription] = useState([]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handlefetchreport = async () => {
    try {
      const response = await axios.get("http://localhost:3000/returnreportReasons", {
      });
      const reverseReport = response.data.reverse();
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
      const response = await axios.get("http://localhost:3000/api/blog");
      const reversedBlogs = response.data.blogs.reverse();
      const SearchText = response.data.blogs.reverse();
      const vector = [];


      SearchText.forEach(item => {
        vector.push(item.description);
      });

      setSeaechDescription(vector);

      SetBlogs(reversedBlogs);

    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const checkID = async () => {
    await handlefetchreport();
    await showreportblogBlogs();
    const vector = [];

    for (let index = 0; index < Blogs.length; index++) {
      for (let indexreport = 0; indexreport < Reports.length; indexreport++) {
        if (Blogs[index]._id == Reports[indexreport].postId) {
          vector.push(Blogs[index]);
        }
      }
    }
    Setshow(vector);
  };


  const handleDropdownClick = () => {
    toggleDropdown();
    checkID();
  };

  const onClickgetblogId = async (blogId) => {
    navigate(`/post/${blogId}`);
    window.location.reload(false);
  };


  // const handleSearch = () => {
  //   props.onSearch(searchText);
  // }

  const debouncedSearch = _.debounce((searchText) => {
    props.onSearch(searchText);
  }, 500); // ปรับเป็นตามความต้องการ

  const handleSearch = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);
    debouncedSearch(searchText);
  };



  useEffect(() => {
    handleDropdownClick();

  }, []);


  return (
    <div className="header">
      <div className="container-logo">
        <span className="free">Free</span>
        <span className="bird">Bird</span>
      </div>

      <div className="container-search">
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearch}
        />
      </div>


    
      <div className="container-icons">
        {/* Dropdown component */}
        <Dropdown menu={{ items }} arrow={{ pointAtCenter: true }}>
        <div className={`dropdown ${isDropdownOpen ? "show" : ""}`}>
            <FontAwesomeIcon icon={faBell} alt="notify-icon" />
          <div id="myDropdown" className="dropdown-content">
            {Array.isArray(Show) &&
              Show.map((blog) => (
                <div key={blog._id}>

                  <p onClick={() => onClickgetblogId(blog._id)}> 
                    <p>{blog.description}</p>
                  </p>
                </div>
              ))}
          </div>
        </div>
        </Dropdown>


        {/* Home icon */}
        <Link to="/home">
          <FontAwesomeIcon icon={faHome} alt="home-icon" />
        </Link>

        {/* User icon */}
        <Link to="/profile">
          <FontAwesomeIcon icon={faUser} alt="profile-icon" />
        </Link>

        <Link to="http://localhost:3000/logout">
          <FontAwesomeIcon icon={faRightFromBracket} alt="logout-icon" />
        </Link>
      </div>
    </div>
  );

}
export default Header;