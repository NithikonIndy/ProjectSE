import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommentPage from "./CommentPage/CommentPage";
import ReportPage from "./ReportPage/ReportPage";
import LoginPage from "./LoginPage/LoginPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/post" element={<CommentPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
