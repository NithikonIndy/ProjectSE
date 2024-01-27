// Import necessary libraries and components
import { useNavigate } from 'react-router-dom';
import React from 'react';
import './Homepage.css'; // Assume a CSS file for styling
import freebird from './picture/freebird.png';
import home from './picture/home.png';
import person from './picture/person.png';

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

// HomePage component
const HomePage = () => {
  let navigate = useNavigate();

  // You can add additional content for the homepage here

  return (
    <div className="homepage">
      <Header /> {/* Add the header */}
      {/* Add more content for the homepage as needed */}
      <h1>Welcome to the Homepage</h1>
      {/* Add more sections, features, or content */}
    </div>
  );
};

export default HomePage;
