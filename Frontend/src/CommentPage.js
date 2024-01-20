import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './CommentPage.css'; // Assume a CSS file for styling
import freebird from './picture/freebird.png';
import home from './picture/home.png';
import person from './picture/person.png';
import axios from 'axios';

const Comment = ({ comment }) => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleReportClick = () => {
    navigate('/report');
  };

  return (
    <div className="comment">
      <p>{comment.description}</p>
      <div className="comment-actions">
        <span className="like">{comment.likes.length} ❤️</span>
        <button className="comment-button" onClick={togglePopup}>
          ...
        </button>
        {showPopup && <Popup onClose={togglePopup} onReport={handleReportClick} />}
      </div>
    </div>
  );
};

const Blog = ({ blog }) => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleReportClick = () => {
    navigate('/report');
  };

  return (
    <div className="comment">
      <p>{blog.description}</p>
      <div className="comment-actions">
        <span className="like">{blog.likes.length} ❤️</span>
        <button className="comment-button" onClick={togglePopup}>
          ...
        </button>
        {showPopup && <Popup onClose={togglePopup} onReport={handleReportClick} />}
      </div>
    </div>
  );
};

const Popup = ({ onClose, onReport }) => (
  <div className="popup">
    <div className="popup-inner">
      <button onClick={onReport}>Report</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  </div>
);

const CommentPage = () => {
  const [comments, setComments] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/blog/659f854a2ad66c8e8baf64f0');
        setBlogs([response.data.blog]);  
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/api/comments/blogs/659f854a2ad66c8e8baf64f0')
      .then((response) => {
        setComments(response.data.blogcomments);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  }, []);

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await axios.get('http://localhost:3000/Userid',{withCredentials: true});
        setUsers([response.data.user]);
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };
  
    getSession();
  }, []);
  
 


  const handleAddComment = () => {
    axios.post('http://localhost:3000/api/comments/blog/659f854a2ad66c8e8baf64f0/add', { user: users,description: newComment })
      .then((response) => {
        setComments([...comments, response.data.comment]);
        setNewComment('');
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
 };

  const handleReportClick = () => {
    navigate('/report');
  };

  return (
    <div className="comment-page">
      {/* Header Component */}
      <div className="comment-page-header">
        <div className="comment-page-logo">
          <img src={freebird} alt="Logo" />
        </div>
        <div className="comment-page-search">
          <input type="text" placeholder="Search..." />
        </div>
        <div className="comment-page-icons">
          <img src={home} alt="Logo" />
          <img src={person} alt="Logo" />
        </div>
      </div>


      {/* Blog*/}
       <h1>Blogs</h1>
      <div className="blog-info">
        {Array.isArray(blogs) && blogs.map((blog) => (
          <Blog key={blog._id} blog={blog} />
        ))}
      </div>


      {/* Comment List */}
      <h1>Comments</h1>
      <div className="comment-list">
        {Array.isArray(comments) && comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>

      {/* Comment Input */}
      <div className="comment-input">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Comment</button>
      </div>
    </div>
  );
};

export default CommentPage;





//  //header component
// const Header = () => (
//   <div className="comment-page-header">
//     <div className="comment-page-logo">
//       {/* Insert your logo image here */}
//       <img src={freebird} alt="Logo" />
//     </div>
//     <div className="comment-page-search">
//       <input type="text" placeholder="Search..." />
//     </div>
//     <div className="comment-page-icons">
//       <img src={home} alt="Logo" />
//       <img src={person} alt="Logo" />
//       {/* Insert icons here */}
//     </div>
//   </div>
// );

// // นำเข้า Popup และ Comment จากไฟล์นี้
// const Popup = ({ onClose, onReport }) => (
//   <div className="popup">
//     <div className="popup-inner">
//       <button onClick={onReport}>Report</button>
//       <button onClick={onClose}>Cancel</button>
//     </div>
//   </div>
// );

// const Comment = ({ text }) => {
//   const [showPopup, setShowPopup] = useState(false);

//   const togglePopup = () => {
//     setShowPopup(!showPopup);
//   };

//   const handleReport = () => {
//     // Handle the report action here
//     console.log('Report clicked');
//     setShowPopup(false);
//   };

  
//   const handleReportClick = () => {
//     navigate('/report'); // Navigate to ReportPage when Report is clicked
//   };

//   let navigate = useNavigate();

// return (
//     <div className="comment">
//       <p>{text}</p>
//       <div className="comment-actions">
//         <span className="like">0 ❤️</span>
//         <button className="comment-button" onClick={togglePopup}>...</button>
//         {showPopup && <Popup onClose={togglePopup} onReport={handleReportClick} />}
//       </div>
//     </div>
//   );
// };

// const CommentPage = () => {
//   let navigate = useNavigate();
//   const [comments, setComments] = useState([
//     'Lorem ipsum dolor sit amet consectetur.',
//     // Add more initial comments here if needed
//   ]);
//   const [newComment, setNewComment] = useState('');

//   const handleAddComment = () => {
//     setComments([...comments, newComment]);
//     setNewComment('');
//   };


//   const handleReportClick = () => {
//     navigate('/report'); // Navigate to ReportPage when Report is clicked
//   };
// return (
//     <div className="comment-page">
//       <Header /> {/* Add the header */}
//       {/* Your existing comment page content */}
//       <h1>Comments</h1>
//       <div className="comment-list">
//         {comments.map((comment, index) => (
//           <Comment key={index} text={comment} />
//         ))}
//       </div>
//       <div className="comment-input">
//         <textarea
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Add a comment..."
//         />
//         <button onClick={handleAddComment}>Comment</button>
//       </div>
//     </div>
//   );
//  };

// export default CommentPage;
