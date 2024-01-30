import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Homepage.css';

const MessageContainer = ({ message }) => (
  <div className="message-container">
    {message}
  </div>
);

const ReportPopup = ({ onClose, onReport }) => (
  <div className="popup">
    <div className="popup-inner">
      <button onClick={onReport}>Report</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  </div>
);

const Homepage = () => {
  const [blogText, setBlogText] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [blogLikes, setBlogLikes] = useState({});
  const [postMessage, setPostMessage] = useState('');
  const navigate = useNavigate();
  const [blogToReport, setBlogToReport] = useState(null);
  const [showReportPopup, setShowReportPopup] = useState(false);

  const handleBlogChange = (event) => {
    setBlogText(event.target.value);
  };

  const handlePostBlog = () => {
    if (blogText.trim() !== '') {
      const newBlog = {
        id: Date.now(),
        content: blogText,
      };

      setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
      setBlogLikes((prevLikes) => ({ ...prevLikes, [newBlog.id]: 0 }));
      setBlogText('');
      setPostMessage('Blog posted successfully!');
    } else {
      setPostMessage('Please enter a blog before posting.');
    }
  };

  const handleLikeBlog = (blogId) => {
    setBlogLikes((prevLikes) => ({
      ...prevLikes,
      [blogId]: prevLikes[blogId] + 1,
    }));
  };

  const handleReportBlog = (blog) => {
    setBlogToReport(blog);
    setShowReportPopup(true);
    navigate('/report'); // เปลี่ยนไปหน้า ReportPage.js
  };

  const closeReportPopup = () => {
    setBlogToReport(null);
    setShowReportPopup(false);
  };

  return (
    <div className="homepage">
      <Header />
      <h1>Blogs</h1>
      <div className="blog-section">
        <textarea
          placeholder="Write your blog here..."
          value={blogText}
          onChange={handleBlogChange}
        />
        <button onClick={handlePostBlog}>Post Blog</button>
      </div>
      <div className="existing-blogs">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-item">
            <MessageContainer message={blog.content} />
            <button onClick={() => handleLikeBlog(blog.id)}>Like</button>
            {blogLikes[blog.id] > 0 && <span>{blogLikes[blog.id]} ❤️</span>}
            <button onClick={() => handleReportBlog(blog)}>Report</button>
          </div>
        ))}
      </div>
      {showReportPopup && (
        <ReportPopup onClose={closeReportPopup} onReport={() => handleReportBlog(blogToReport)} />
      )}
    </div>
  );
};

export default Homepage;
