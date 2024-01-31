import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./ReportPage.css"; // Reusing the styles from CommentPage
import Header from "../Header/Header.js";

const Reason = ({ text, onSelect }) => (
  <div className="reason" onClick={() => onSelect(text)}>
    {text}
  </div>
);

const ReportPage = () => {
  const [selectedReason, setSelectedReason] = useState("");
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
