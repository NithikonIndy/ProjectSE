import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./Homepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faFlag, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import { uniqueNamesGenerator, Config, animals } from "unique-names-generator";
import Swal from "sweetalert2";
import { Container } from "react-bootstrap";
import { Select, Space } from 'antd';
import {
  faBell,
  faHome,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const MessageContainer = ({ message }) => (
  <div className="message-container">{message}</div>
);









const generateRandomNameForUserId = (userId, blogId) => {
  const seed = userId + blogId; // Use the user ID as the seed
  const config = {
    dictionaries: [animals],
    seed: seed,
  };

  return uniqueNamesGenerator(config);
};

const Homepage = () => {
  const [blogText, setBlogText] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [blogLikes, setBlogLikes] = useState({});
  const [postMessage, setPostMessage] = useState("");
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editedBlogId, setEditedBlogId] = useState(null);
  const [users, setUsers] = useState([]);
  const [Blogs, SetBlogs] = useState([]);
  const [likespost, setLikespost] = useState([]);
  const [clickedBlogId, setClickedBlogId] = useState([]);
  const [blogdelete, setblogdelete] = useState([]);
  const [Edit, setEdit] = useState([]);

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

  const AlertEdit = (blogid) => {
    Swal.fire({
      title: "Enter text",
      input: "text",
      inputLabel: "Your text",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const editedText = result.value;
        if (editedText) {
          setBlogText(editedText); // Set the edited text to the state
          Swal.fire({
            title: "Edit!",
            text: `Your post has been edited.`,
            icon: "success",
          });
          handleEditBlog(blogid, editedText); // Pass the edited text to handleEditBlog
        }
      }
    });
  };



  const AlertReport = async (blogid) => {
    console.log(blogid);
    try {
      // deconstruct the response to get the data
      const { data: fetchReasons } = await axios.get(
        "http://localhost:3000/reportReasons"
      );
      console.log(fetchReasons);

      Swal.fire({
        title: "Firmly to report?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, report it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { value: reasons } = await Swal.fire({
            title: "Please select your reasons",
            input: "select",
            inputOptions: fetchReasons,
            inputPlaceholder: "Please select your reasons",
            showCancelButton: true,
            inputValidator: (result) => {
              console.log("inputValidator:", result);
              return !result && "You need to select the reason!";
            },
          });

          if (reasons) {
            try {
              const reason = fetchReasons[reasons];
              await axios.post(
                `http://localhost:3000/api/blog/${blogid}/report`,
                { reason },
                { withCredentials: true }
              );
            } catch (error) {
              console.log(error);
            }
            Swal.fire({
              title: "Report!",
              text: `Your report reason[${reasons}] has submitted.`,
              icon: "success",
            });
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await axios.get("http://localhost:3000/Userid", {
          withCredentials: true,
        });
        setUsers([response.data.user]);
      } catch (error) {
        console.error("Error fetching user session:", error);
      }
    };

    getSession();
  }, []);

  const onClickgetblogId = async (blogId) => {
    setClickedBlogId(blogId);
    navigate(`/post/${blogId}`);
    console.log("hll");
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
    await axios
      .post(`http://localhost:3000/api/blog/add`, {
        user: users[0], // Assuming users is an array and you want the first user
        description: blogText,
      })
      .then((response) => {
        SetBlogs([...Blogs, response.data.blog]);
        setBlogText("");
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

  const handleEditBlog = (blogId, editedText) => {
    const apiurl = `http://localhost:3000/api/blog/update/${blogId}`;
    axios
      .put(apiurl, {
        user: users[0],
        description: editedText, // Use the edited text
      })
      .then((response) => {
        console.log("Edit successful", response.data);
      })
      .catch((error) => {
        console.error("Error editing resource", error);
      });
    setTimeout(() => {
      fetchBlogs();
    }, 400);
  };

  const hidedeletebuttons = (blogId) => {
    const isBlogOwner = blogId === users[0];
    const buttonToToggle = document.getElementById(`deleteButton-${blogId}`);

    if (buttonToToggle) {
      buttonToToggle.style.display = isBlogOwner ? "block" : "none";
    }
  };

  const handleDeleteBlog = (blogId) => {
    const apiurl = `http://localhost:3000/api/blog/${blogId}`;
    axios
      .delete(apiurl)
      .then((response) => {
        console.log("Delete successful", response.data);
      })
      .catch((error) => {
        console.error("Error deleting resource", error);
      });
    setTimeout(() => {
      fetchBlogs();
    }, 400);
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/blog");
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
      console.error("Error fetching blogs:", error);
    }
  };

  const fetchTrendingBlogs = async () => {
    try {
        const response = await axios.get("http://localhost:3000/api/blog");
        const sortedBlogs = response.data.blogs.sort((a, b) => b.likes.length - a.likes.length);
        SetBlogs(sortedBlogs);
    } catch (error) {
        console.error("Error fetching trending blogs:", error);
    }
};



  useEffect(() => {
    fetchBlogs();

    setTimeout(() => {
      hidedeletebuttons(users);
    }, 100);
  }, []);


  const handleSortChange = (e) => {
    const sortType = e.target.value;
    if (sortType === "trending") {
      fetchTrendingBlogs();
    } else {
      fetchBlogs();
    }
  };
  return (
    <div className="homepage">
      <Header />
      <div class="sel sel--black-panther">
          <Space
        direction="vertical"
        style={{
          width: '100%',
        }}
      >
        <Select
          status="error"
          style={{
            width: '100%',
          }}
        />
        <Select
          status="warning"
          style={{
            width: '100%',
          }}
        />
      </Space>
      </div>
      <Container className="padding-container">
        <div className="blog-section" style={{ position: "relative" }}>
          <textarea
            placeholder="Write your blog here..."
            value={blogText}
            onChange={handleBlogChange}
            rows="10"
          />

          <button
            onClick={() => {
              handlePostBlog();
              setTimeout(() => {
                fetchBlogs();
              }, 350);
            }}

          style={{ position: "absolute", right: "12px", bottom: "30px" }}
          >
            Post Blog
          </button>

        </div>

        {Array.isArray(Blogs) &&
          Blogs.map((blog) => (

            <div key={blog._id} className="blog-item" >
              <div class="row">
                <div>
                  <FontAwesomeIcon icon={faUser} />
                  <strong style={{ marginLeft: '6px' }}><i>{generateRandomNameForUserId(blog.user, blog._id)}</i></strong>
                  <p>{blog.description}</p>
                </div>
              </div>
              <div class="row">
                <div className="blog-icons">
                  <button onClick={() => onClicklikeblog(blog._id)}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                    {blog.likes.length}
                  </button>
                  <button onClick={() => AlertReport(blog._id)}>
                    <FontAwesomeIcon icon={faFlag} />
                  </button>

                {blog.user === users[0] && (
                  <button
                    id={`editButton-${blog._id}`}
                    onClick={() => {
                      AlertEdit(blog._id);
                      setTimeout(() => {
                        fetchBlogs();
                      }, 1000);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                )}
                <button onClick={() => {
                  onClickgetblogId(blog._id);
                }}> 
                    comment
                  </button>


                  {blog.user === users[0] && (
                    <button
                      id={`deleteButton-${blog._id}`}
                      onClick={() => {
                        AlertDelete(blog._id);

                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

            </div>

          ))}

      </Container>
    </div>
  );
};

export default Homepage;








