import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './Homepage.css';
import ReportPage from '../ReportPage/ReportPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faFlag, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { uniqueNamesGenerator, Config, animals } from 'unique-names-generator';
import Swal from "sweetalert2";

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
  const [blogdelete, setblogdelete] = useState([]);


  const AlertDelete = (blogid) => {
    Swal.fire({
      title: "Firmly to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        handleDeleteBlog(blogid);
      }
    });
  };

  const AlertReport = () => {
    Swal.fire({
      title: "Firmly to report?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, report it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Report!",
          text: "Your file has been deleted.",
          icon: "success",
        });

      }
    });
  };


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



  const onClickgetblogId = async (blogId) => {
    setClickedBlogId(blogId);
    navigate(`/post/${blogId}`);
  };

  const onClicklikeblog = async (blogId) => {
    console.log("Clicked on blog with ID:", blogId);
    handleLikeBlog(blogId);
    setTimeout(() => {
      fetchBlogs();
    }, 250);
  };


  const handleBlogChange = (event) => {
    setBlogText(event.target.value);
  };


  const handlePostBlog = async () => {
    await axios.post(
      `http://localhost:3000/api/blog/add`,
      {
        user: users[0], // Assuming users is an array and you want the first user
        description: blogText,
      }
    ).then((response) => {
      SetBlogs([...Blogs, response.data.blog]);
      setBlogText('');
    })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });

  };

  const handleLikeBlog = async (blogId) => {
    // Use the blogId directly
    let temp = blogId;

    // Ensure temp has a valid value before using it in the URL
    if (temp) {
      const text = `http://localhost:3000/api/blog/${temp}/like`;

      try {
        const response = await axios.put(text, {
          UserId: users[0],
        });
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("No blogId available");
    }

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

  const hidedeletebuttons = (blogId) => {
    const isBlogOwner = blogId === users[0];
    const buttonToToggle = document.getElementById(`deleteButton-${blogId}`);

    if (buttonToToggle) {
      buttonToToggle.style.display = isBlogOwner ? "block" : "none";
    }
  };





  const handleDeleteBlog = (blogId) => {
    const apiurl = `http://localhost:3000/api/blog/${blogId}`
    axios.delete(apiurl)
      .then(response => {
        console.log('Delete successful', response.data);
      })
      .catch(error => {
        console.error('Error deleting resource', error);
      });
    console.log("hello", blogId);
  };

  const fetchBlogs = async () => {
    ;
    try {
      const response = await axios.get('http://localhost:3000/api/blog');
      let i = 0;
      let end = response.data.blogs.length - 1;
      const Blog = [];
      while (end >= i) {

        Blog.push(response.data.blogs[end]);
        end--;
      }
      SetBlogs(Blog);

      // setLikespost([response.data.blog.likes.length]);


    } catch (error) {
      console.error('Error fetching blogs:', error);
    }



  };


  useEffect(() => {
    fetchBlogs();

    setTimeout(() => {
      hidedeletebuttons(users);
    }, 100);
  }, []);



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
        <button onClick={() => {
          handlePostBlog();
          setTimeout(() => {
            fetchBlogs();
          }, 350);
        }}>
          Post Blog</button>
      </div>

      {/* {blog} */}
      <div className="existing-blogs">
        {Array.isArray(Blogs) &&
          Blogs.map((blog) => (
            <div key={blog._id} className="blog-item" >
              <div onClick={() => { onClickgetblogId(blog._id); }}>
                <p>{generateRandomNameForUserId(blog.user)}</p>
                <p>{blog.description}</p>
              </div>
              <h1>{blog._id}</h1>
              <div className="blog-icons">
                <button onClick={() => onClicklikeblog(blog._id)}>
                  <FontAwesomeIcon icon={faThumbsUp} />
                  {blog.likes.length}
                </button>
                <button onClick={() => AlertReport()}>
                  <FontAwesomeIcon icon={faFlag} />
                </button>
                <button onClick={() => handleEditBlog(blog.id)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>


                {blog.user === users[0] && (
                  <button
                    id={`deleteButton-${blog._id}`}
                    onClick={() => {
                      AlertDelete(blog._id);
                      setTimeout(() => {
                        fetchBlogs();
                      }, 1000);
                    }}
                  >
                    Delete
                  </button>
                )}

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