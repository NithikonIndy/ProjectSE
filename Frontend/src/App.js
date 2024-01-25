import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CommentPage from './CommentPage';
import ReportPage from './ReportPage';
import Homepage from './Homepage';
import Header from './Header';
import './App.css';
import '@mantine/core/styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/post" element={<CommentPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/home" element={<Homepage/>} />
        <Route path="/hd" element={<Header/>} />
      </Routes>
    </Router>
  );
}

export default App;
