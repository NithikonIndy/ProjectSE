import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import CommentPage from './CommentPage';
import ReportPage from './ReportPage';
=======
import CommentPage from './CommentPage/CommentPage';
import ReportPage from './ReportPage/ReportPage';
import LoginPage from "./LoginPage/LoginPage";
import HomePage from './Homepage/Homepage';
>>>>>>> f4bb12d4010dc816ee48dc8fa8d2776a4715669b
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/post" element={<CommentPage />} />
        <Route path="/report" element={<ReportPage />} />
<<<<<<< HEAD
=======
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
>>>>>>> f4bb12d4010dc816ee48dc8fa8d2776a4715669b
      </Routes>
    </Router>
  );
}

export default App;
