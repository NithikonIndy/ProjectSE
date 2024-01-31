import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Homepage.css'; // Assume a CSS file for styling
import freebird from '../Header/picture/freebird.png'
import home from '../Header/picture/home.png';
import person from '../Header/picture/person.png';
import axios from 'axios';
import { uniqueNamesGenerator, Config, animals } from 'unique-names-generator';
import '../CommentPage/CommentPage.css';
import { useParams } from 'react-router-dom';




// Header component (reuse from CommentPage)
const Header = () => (
  <div className="homepage-header">
    <div className="homepage-logo">
      <img src={freebird} alt="Logo" />
    </div>
    <div className="homepage-search">
      <input type="text" placeholder="Search..." />
    </div>
    <div className="homepage-icons">
      <img src={home} alt="Logo" />
      <img src={person} alt="Logo" />
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

const Popup = ({ onClose, onReport }) => (
  <div className="popup">
    <div className="popup-inner">
      <button onClick={onReport}>Report</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  </div>
);

const Comment = ({ text }) => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleReport = () => {
    // Handle the report action here
    console.log('Report clicked');
    setShowPopup(false);
  };

  
  const handleReportClick = () => {
    navigate('/report'); // Navigate to ReportPage when Report is clicked
  };

  let navigate = useNavigate();

return (
  <div className="comment">
    <p>{text}</p>
      <div className="comment-actions">
        <span className="like">0 ❤️</span>
      <button className="comment-button" onClick={togglePopup}>...</button>
      {showPopup && <Popup onClose={togglePopup} onReport={handleReportClick} />}
    </div>
  </div>
  );
};

// HomePage component
const HomePage = () => {
  let navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [Blogs, SetBlogs] = useState([]);
  const [likespost, setLikespost] = useState([]);
  const [clickedBlogId, setClickedBlogId] = useState([]);
  let { blogIdforget } = useParams();

  /*Userid */
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

  /*one blog */
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


  

  return (
    <div className="homepage">
    <div class="container">
      <Header />


      {/* <Route path={`/post/:blogIdforget`} element={<Comment />} /> */}

        <h1>Blogs</h1>
        <p>{Blogs._id}</p>
      <div className="comment">
        <div className="comment-list">
        {Array.isArray(Blogs) &&
            Blogs.map((blog) => (
              <div key={blog._id} className="comment" onClick={() => {onClickgetblogId(blog._id);}}>
                <p>{generateRandomNameForUserId(blog.user)}</p>
                <p>{blog.description}</p>
                <div className="comment-actions">
                <span className="like" >
                  {0} ❤️
                </span>
                </div>
              </div>
            ))}
        </div>
      </div> 






    </div>
  </div>

  
  );
};


export default HomePage;
