import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CommentPage from './CommentPage/CommentPage';
import ReportPage from './ReportPage/ReportPage';
import LoginPage from "./LoginPage/LoginPage";
import HomePage from './Homepage/Homepage';
import './App.css';
import ProfilePage from './ProfilePage/ProfilePage';
import Header from './Header/Header';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/post/:blogId" element={<CommentPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/hd" element={<Header />} />
      </Routes>
    </Router>
  );
}

export default App;