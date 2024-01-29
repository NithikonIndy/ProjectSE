import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CommentPage from './CommentPage';
import ReportPage from './ReportPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/post" element={<CommentPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
