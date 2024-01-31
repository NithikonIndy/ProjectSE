import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< Updated upstream
import Header from '../Header/Header';
import './Homepage.css';
import ReportPage from '../ReportPage/ReportPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faFlag, faEdit } from '@fortawesome/free-solid-svg-icons';
=======
import React from 'react';
import './Homepage.css'; // Assume a CSS file for styling
import freebird from '../Header/picture/freebird.png';
import home from '../Header/picture/home.png';
import person from '../Header/picture/person.png';
>>>>>>> Stashed changes

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

// ... (imports อื่น ๆ)

const Homepage = () => {
  const [blogText, setBlogText] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [blogLikes, setBlogLikes] = useState({});
  const [postMessage, setPostMessage] = useState('');
  const navigate = useNavigate();
  const [blogToReport, setBlogToReport] = useState(null);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedBlogId, setEditedBlogId] = useState(null);

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
  };

  const closeReportPopup = () => {
    setBlogToReport(null);
    setShowReportPopup(false);
  };

  const goToReportPage = () => {
    // ใช้ navigate เพื่อไปที่หน้า ReportPage และส่งข้อมูล blog ที่ต้องการรายงานไปด้วย
    navigate(`/report/`);
    closeReportPopup(); // ปิด pop-up เมื่อไปที่หน้า ReportPage
  };

  const handleEditBlog = (blogId) => {
    const blogToEdit = blogs.find(blog => blog.id === blogId);
    if (blogToEdit) {
      setBlogText(blogToEdit.content);
      setEditMode(true);
      setEditedBlogId(blogId);
    }
  };

  const handleSaveEdit = () => {
    if (blogText.trim() !== '') {
      setBlogs(prevBlogs => prevBlogs.map(blog =>
        blog.id === editedBlogId ? { ...blog, content: blogText } : blog
      ));
      setBlogText('');
      setPostMessage('Blog edited successfully!');
      setEditMode(false);
      setEditedBlogId(null);
    } else {
      setPostMessage('Please enter a blog before editing.');
    }
  };

  const handleCancelEdit = () => {
    setBlogText('');
    setEditMode(false);
    setEditedBlogId(null);
  };

  const handleDeleteBlog = (blogId) => {
    // แสดง pop-up ให้เลือกระหว่าง Delete หรือ Cancel
    if (window.confirm('Are you sure you want to delete this blog?')) {
      // ลบ Blog ที่ต้องการ
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
      setPostMessage('Blog deleted successfully!');
    }
  };

  const onClickGoToCommentPage = (blogId) => {
    // ใช้ navigate เพื่อไปที่หน้า CommentPage และส่งข้อมูล blogId ไปด้วย
    navigate(`/post`);
  };

  return (
    <div className="homepage">
<<<<<<< Updated upstream
      <Header />
      <h4>Blogs</h4>
      <div className="blog-section">
        <textarea
          placeholder="Write your blog here..."
          value={blogText}
          onChange={handleBlogChange}
        />
        <button onClick={handlePostBlog}>Post Blog</button>
=======
      <div class="container">
>>>>>>> Stashed changes
      </div>
      <div className="existing-blogs">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-item">
            <MessageContainer message={blog.content} />
            <div className="blog-icons">
              <button onClick={() => handleLikeBlog(blog.id)}>
                <FontAwesomeIcon icon={faThumbsUp} />
              </button>
              {blogLikes[blog.id] > 0 && <span>{blogLikes[blog.id]} ❤️</span>}
              <button onClick={() => handleReportBlog(blog)}>
                <FontAwesomeIcon icon={faFlag} />
              </button>
              <button onClick={() => handleEditBlog(blog.id)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => handleDeleteBlog(blog.id)}>
                Delete
              </button>
              <button onClick={() => onClickGoToCommentPage(blog.id)}>
                Go to Comment Page
              </button>
            </div>
          </div>
        ))}
      </div>
      {showReportPopup && (
        <ReportPopup onClose={closeReportPopup} onReport={goToReportPage} />
      )}
      {editMode && (
        <div>
          <textarea
            placeholder="Edit your blog here..."
            value={blogText}
            onChange={(e) => setBlogText(e.target.value)}
          />
          <button onClick={handleSaveEdit}>Save Edit</button>
          <button onClick={handleCancelEdit}>Cancel Edit</button>
        </div>
      )}

    </div>
  );
};

export default Homepage;
