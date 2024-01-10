
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReportPage.css'; // Reusing the styles from CommentPage
import freebird from './picture/freebird.png';
import home from './picture/home.png';
import person from './picture/person.png';

// Reuse the Header component from CommentPage
// ... (The Header component code goes here, no changes needed)
const Header = () => (
  <div className="comment-page-header">
    <div className="comment-page-logo">
      {/* Insert your logo image here */}
      <img src={freebird} alt="Logo" />
    </div>
    <div className="comment-page-search">
      <input type="text" placeholder="Search..." />
    </div>
    <div className="comment-page-icons">
      <img src={home} alt="Logo" />
      <img src={person} alt="Logo" />
      {/* Insert icons here */}
    </div>
  </div>
);


const Reason = ({ text, onSelect }) => (
  <div className="reason" onClick={() => onSelect(text)}>
    {text}
  </div>
);

const ReportPage = () => {
  const [selectedReason, setSelectedReason] = useState('');
  let navigate = useNavigate();
  const handleSelectReason = (reason) => {
    setSelectedReason(reason);
    // Here you can add more logic for what happens when a reason is selected
    console.log(`Selected reason: ${reason}`);
  };

  return (
    <div className="report-page">
      <Header />
      <div className="reasons-list">
        <Reason text="เหตุผล 1" onSelect={handleSelectReason} />
        <Reason text="เหตุผล 2" onSelect={handleSelectReason} />
        <Reason text="เหตุผล 3" onSelect={handleSelectReason} />
        {/* Add more reasons as needed */}
      </div>
    </div>
  );
};

export default ReportPage;
