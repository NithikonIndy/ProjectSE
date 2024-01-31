// Import necessary libraries and components
// ในไฟล์ JavaScript หรือ React component
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
<<<<<<< Updated upstream
import Header from '../Header/Header';
import './Homepage.css';
import ReportPage from '../ReportPage/ReportPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faFlag, faEdit } from '@fortawesome/free-solid-svg-icons';
=======
import React, { useState, useEffect } from 'react';
import './Homepage.css'; // Assume a CSS file for styling
import freebird from '../Header/picture/freebird.png';
import home from '../Header/picture/home.png';
import person from '../Header/picture/person.png';

// Header component (reuse from CommentPage)
const Header = () => (
  <div className="homepage-header">
    <div className="homepage-logo">
      <img src={freebird} alt="Logo" />
    </div>
    <div className="homepage-search">
      <input type="text" placeholder="Search..." />
    </div>
    <div className="homepage-icons">
      <img src={home} alt="Logo" />
      <img src={person} alt="Logo" />
      {/* Insert icons here */}
    </div>
  </div>
);

const Comment = ({ text }) => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleReport = () => {
    // Handle the report action here
    console.log('Report clicked');
    setShowPopup(false);
  };

  
  const handleReportClick = () => {
    navigate('/report'); // Navigate to ReportPage when Report is clicked
  };

  let navigate = useNavigate();

return (
  <div className="comment">
    <p>{text}</p>
      <div className="comment-actions">
        <span className="like">0 ❤️</span>
      <button className="comment-button" onClick={togglePopup}>...</button>
      {showPopup && <Popup onClose={togglePopup} onReport={handleReportClick} />}
    </div>
  </div>
  );
};

// HomePage component
const HomePage = () => {
  let navigate = useNavigate();

  // You can add additional content for the homepage here

  return (
    <div className="homepage">
      <div class="container">
       asfsafsa
      </div>
      <Header /> {/* Add the header */}
      {/* Add more content for the homepage as needed */}
      <h1>Blogs</h1>
      {/* Add more sections, features, or content */}
    </div>
  </div>

  
  );
};

export default Homepage;
