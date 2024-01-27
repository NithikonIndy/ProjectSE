import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './CommentPage.css'; // Assume a CSS file for styling
import Header from './Header/Header.js';

//header component




// นำเข้า Popup และ Comment จากไฟล์นี้
const Popup = ({ onClose, onReport }) => (
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

const CommentPage = () => {
  let navigate = useNavigate();
  const [comments, setComments] = useState([
    'Lorem ipsum dolor sit amet consectetur.',
    // Add more initial comments here if needed
  ]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    setComments([...comments, newComment]);
    setNewComment('');
  };

  
  const handleReportClick = () => {
    navigate('/report'); // Navigate to ReportPage when Report is clicked
  };
return (
    <div className="comment-page">
      <Header /> {/* Add the header */}
      {/* Your existing comment page content */}
      <h1>Comments</h1>
      <div className="comment-list">
        {comments.map((comment, index) => (
          <Comment key={index} text={comment} />
        ))}
      </div>
      <div className="comment-input">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Comment</button>
      </div>
    </div>
  );
};

export default CommentPage;
