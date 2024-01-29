import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CommentPage.css';
import freebird from './picture/freebird.png';
import home from './picture/home.png';
import person from './picture/person.png';
import { uniqueNamesGenerator, Config, animals } from 'unique-names-generator';
import { set } from 'mongoose';



const Popup = ({ onClose, onReport }) => (
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

const CommentPage = () => {
  const [comments, setComments] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [users, setUsers] = useState([]);
  const [blogComment, setBlogComment] =useState([]);
  const [clickedBlogId, setClickedBlogId] = useState([]);
  const [likespost, setLikespost] = useState();
  const [clickedcommentId, setClickedcommentId] = useState([]);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);



  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleReportClick = () => {
    navigate('/report');
  };


  
  const onClickgetblogId = async(blogId) => {
    console.log('Clicked on blog with ID:', blogId);
    setClickedBlogId(blogId); // Store the clicked blogId in state
    likePost(blogId); // Call likePost with the blogId
    setTimeout(() => {
      fetchlike(blogId);
    }, 250);
  };


  const onClickgetcommentId = async(commentId) => {
    console.log('Clicked on Comment with ID:', commentId);
    setClickedcommentId(commentId); 
    likecoment(commentId); 
    setTimeout(() => {
      fetchComments();
    }, 250);
  };
  


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
        const response = await axios.get('http://localhost:3000/api/blog/659f854a2ad66c8e8baf64f0');
        setBlogs([response.data.blog]);
        setBlogComment([response.data.blog._id]);
        setLikespost([response.data.blog.likes.length])
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  /*comment*/
useEffect(() => {
  const fetchComments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/comments/blogs/659f854a2ad66c8e8baf64f0');
      let i = 0;
      let end= response.data.blogcomments.length ;
      const accumulatedComments = [];
     

      while(i < end){
        if (response.data.blogcomments[i].blog == blogComment) {
            accumulatedComments.push(response.data.blogcomments[i]);
           
        }
        i++;
      }
      
      setComments(accumulatedComments);

    } catch (err) {
      console.log('Error fetching comments:', err);
    }
  };

  fetchComments();
}, [blogComment]);

  /*addcomment */
  const handleAddComment = () => {
    axios.post('http://localhost:3000/api/comments/blog/659f854a2ad66c8e8baf64f0/add', {
      user: users,
      description: newComment,
    })
      .then((response) => {
        setComments([...comments, response.data.comment]);
        setNewComment('');
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };
  


  /*like post */
  const likePost = async (blogId) => {
    // Use the blogId directly
    let temp = blogId;

    // Ensure temp has a valid value before using it in the URL
    if (temp) {
      let text = `http://localhost:3000/api/blog/${temp}/like`;

      try {
        const response = await axios.put(text, {
          UserId: users[0],
        });
        console.log(response.data);
        

      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('No blogId available');
    }
    
  };

  const fetchlike = async(blogId) => {
        // Fetch likes separately, if needed
        let temp = blogId;
        let text = `http://localhost:3000/api/blog/${temp}`
        try {
          const response = await axios.get(text);
          setLikespost(response.data.blog.likes.length);
        } catch (err) {
          console.log('Error fetching likes:', err);
        }
  };

  const likecoment = async (commentId) => {
    let temp = commentId;
    if (temp) {
      let text = `http://localhost:3000/api/comments/blog/${temp}/like`;
      try {
        const response = await axios.put(text, {
          userId: users[0],
        });
  
        console.log(response.data);
  
      } catch (err) {
        console.log("bug", err);
      }
    }
  };
  
 const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/comments/blogs/659f854a2ad66c8e8baf64f0`);
      let i = 0;
      let end= response.data.blogcomments.length ;
      const accumulatedComments = [];
     

      while(i < end){
        if (response.data.blogcomments[i].blog == blogComment) {
            accumulatedComments.push(response.data.blogcomments[i]);
           
        }
        i++;
      }
      
      setComments(accumulatedComments);

    } catch (err) {
      console.log('Error fetching comments:', err);
    }
  };
  
  
  

  return (
    <div className="comment-page">
      {/* Header Component */}
      <div className="comment-page-header">
        <div className="comment-page-logo">
          <img src={freebird} alt="Logo" />
          <input type="text" placeholder="Search..." className="comment-page-search"/>
        </div>
        <div className="comment-page-search">
        </div>
        <div className="comment-page-icons">
          <img src={home} alt="Logo" />
          <img src={person} alt="Logo" />
        </div>
      </div>

    
      
      {/* Blog */}
      <h1>Blogs</h1>
      <div className="comment">
        {Array.isArray(blogs) &&
          blogs.map((blog) => (
            <div key={blog._id} className="blog">
              <p>{generateRandomNameForUserId(blog.user)}</p>
              <p>{blog.description}</p>
              <div className="comment-actions">
              <span
                  className="like"
                  onClick={() => {
                    onClickgetblogId(blog._id); //fetchlike
                  }}
                >
                  {likespost} ❤️
                </span>
                <button className="comment-button" onClick={togglePopup}>
                  ...
                </button>
                {showPopup && <Popup onClose={togglePopup} onReport={() => navigate('/report')} />}
              </div>
            </div>
          ))}
      </div>




    {/* Comment List */}

       <h1>Comments</h1>
      <div className="comment">
        <div className="comment-list">
        {Array.isArray(comments) &&
            comments.map((comment) => (
              <div key={comment._id} className="comment">
                <p>{generateRandomNameForUserId(comment.user)}</p>
                <p>{comment.description}</p>
                <div className="comment-actions">
                  <span
                    className="like"
                    onClick={() => {
                      onClickgetcommentId(comment._id);
                    }}
                  >
                    {comment.likes ? comment.likes.length : 0} ❤️
                  </span>
                  <button className="comment-button" onClick={togglePopup}>
                    ...
                  </button>
                  {showPopup && <Popup onClose={togglePopup} onReport={handleReportClick} />}
                </div>
              </div>
            ))}
        </div>
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
