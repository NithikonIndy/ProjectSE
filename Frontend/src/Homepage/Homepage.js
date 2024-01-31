import React, { useState ,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './Homepage.css';
import ReportPage from '../ReportPage/ReportPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faFlag, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { uniqueNamesGenerator, Config, animals } from 'unique-names-generator';

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

const generateRandomNameForUserId = (userId) => {
  const seed = userId; // Use the user ID as the seed
  const config = {
    dictionaries: [animals],
    seed: seed,
  };

  return uniqueNamesGenerator(config);
};



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
  const [users, setUsers] = useState([]);
  const [Blogs, SetBlogs] = useState([]);
  const [likespost, setLikespost] = useState([]);
  const [clickedBlogId, setClickedBlogId] = useState([]);
  const { blogIdforget } = useParams();

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await axios.get('http://localhost:3000/Userid', { withCredentials: true });
        setUsers([response.data.user]);
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };

    getSession();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/blog');
        let i = 0;
        let end= response.data.blogs.length -1;
        const Blog = [];
        while( end >= i){

           Blog.push(response.data.blogs[end]);
          end--;
        }
        
        

        SetBlogs(Blog);

        // setLikespost([response.data.blog.likes.length]);
       
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const onClickgetblogId = async(blogId) => {
    console.log('Clicked on blog with ID:', blogId);
    setClickedBlogId(blogId); // Store the clicked blogId in state
    navigate(`/post/${blogId}`);
  };


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



  return (
    <div className="homepage">
      <Header />
      <h4>Blogs</h4>
      <div className="blog-section">
        <textarea
          placeholder="Write your blog here..."
          value={blogText}
          onChange={handleBlogChange}
        />
        <button onClick={handlePostBlog}>Post Blog</button>
      </div>

      {/* {blog} */}
      <div className="existing-blogs">
        {Array.isArray(Blogs) &&
            Blogs.map((blog) => (
              <div key={blog._id} className="blog-item" >
                <div onClick={() => {onClickgetblogId(blog._id);}}>
                <p>{generateRandomNameForUserId(blog.user)}</p>
                <p>{blog.description}</p>
                </div>
                <div className="blog-icons">
              <button onClick={() => handleLikeBlog(blog.id)}>
                <FontAwesomeIcon icon={faThumbsUp} />
              </button>
              <button onClick={() => handleReportBlog(blog)}>
                <FontAwesomeIcon icon={faFlag} />
              </button>
              <button onClick={() => handleEditBlog(blog.id)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => handleDeleteBlog(blog.id)}>
                Delete
              </button>

            </div>

              </div>
            ))}
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
      {/* ... (ต่อไป) */}
    </div>
  );
};

export default Homepage;