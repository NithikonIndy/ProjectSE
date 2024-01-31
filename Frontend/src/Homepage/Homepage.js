// Import necessary libraries and components
// ในไฟล์ JavaScript หรือ React component
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
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

const MessageContainer = ({ message }) => (
  <div className="message-container">
    {message}
  </div>
);

const ReportPopup = ({ onClose, onReport }) => (
  <div className="popup">
    <div className="popup-inner">
      <button onClick={onReport}>Report</button>
      <button onClick={onClose}>Cancel</button>
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
      <Header />
      <h4>Blogs</h4>
      <div className="blog-section">
        <textarea
          placeholder="Write your blog here..."
          value={blogText}
          onChange={handleBlogChange}
        />
        <button onClick={handlePostBlog}>Post Blog</button>
      </div>
      <div className="existing-blogs">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-item">
            <MessageContainer message={blog.content} />
            <div className="blog-icons">
              <button onClick={() => handleLikeBlog(blog.id)}>
                <FontAwesomeIcon icon={faThumbsUp} />
              </button>
              {blogLikes[blog.id] > 0 && <span>{blogLikes[blog.id]} ❤️</span>}
              <button onClick={() => handleReportBlog(blog)}>
                <FontAwesomeIcon icon={faFlag} />
              </button>
              <button onClick={() => handleEditBlog(blog.id)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => handleDeleteBlog(blog.id)}>
                Delete
              </button>
              <button onClick={() => onClickGoToCommentPage(blog.id)}>
                Go to Comment Page
              </button>
            </div>
          </div>
        ))}
      </div>
      {showReportPopup && (
        <ReportPopup onClose={closeReportPopup} onReport={goToReportPage} />
      )}
      {editMode && (
        <div>
          <textarea
            placeholder="Edit your blog here..."
            value={blogText}
            onChange={(e) => setBlogText(e.target.value)}
          />
          <button onClick={handleSaveEdit}>Save Edit</button>
          <button onClick={handleCancelEdit}>Cancel Edit</button>
        </div>
      )}
      {/* ... (ต่อไป) */}
    </div>
  );
};

export default Homepage;
