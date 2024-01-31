import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CommentPage from './CommentPage/CommentPage';
import ReportPage from './ReportPage/ReportPage';
import LoginPage from "./LoginPage/LoginPage";
import HomePage from './Homepage/Homepage';
import './App.css';
import ProfilePage from './ProfilePage/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/post" element={<CommentPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;