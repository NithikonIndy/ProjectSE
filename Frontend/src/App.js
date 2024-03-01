import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CommentPage from './CommentPage/CommentPage';
import LoginPage from "./LoginPage/LoginPage";
import HomePage from './Homepage/Homepage';
import './App.css';
import ProfilePage from './ProfilePage/ProfilePage';
import Header from './Header/Header';
import YourBlog from "./ProfilePage/YourBlog";
import YourCOm from "./ProfilePage/YourCom";
import YourCom from './ProfilePage/YourCom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/post/:blogId" element={<CommentPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/hd" element={<Header />} />
        <Route path="/YourBlog" element={<YourBlog />} />
        <Route path="/YourCom" element={<YourCom />} />
      </Routes>
    </Router>
  );
}

export default App;