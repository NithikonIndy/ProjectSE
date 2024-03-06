import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./Homepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faFlag, faEdit ,faComments,faTrash} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { uniqueNamesGenerator, animals } from "unique-names-generator";
import Swal from "sweetalert2";
import { Container } from "react-bootstrap";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const generateRandomNameForUserId = (userId, blogId) => {
  const seed = userId + blogId;
  const config = {
    dictionaries: [animals],
    seed: seed,
  };
  return uniqueNamesGenerator(config);
};

const Homepage = () => {
  const [blogText, setBlogText] = useState("");
  const navigate = useNavigate();
  const [users, setUsers] = useState("");
  const [Blogs, SetBlogs] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [blogsAccount, setBlogsAccount] = useState([]);

  useEffect(() => {
    fetchSession();
    fetchBlogs();
  }, []);

  const fetchSession = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/user/status", {
        withCredentials: true,
      });
      console.log("log obj data: " ,response.data);
      console.log("log userID: " ,response.data._id);
      setUsers(response.data._id);
      console.log("log users: " ,response.data._id);
      fetchUserRole();        
      // if (!response.data) {
      //     console.log("!response.data.user");
      //     // fetchLogOut();
      //     // navigate("/");
      // } else {
      // }
        console.log("This session user:", response.data.name);
      } catch (error) {
        console.error("Error fetching user session:", error);
    }
  };  

  const fetchLogOut = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/user/deleteSession", {
        withCredentials: true,
      });
      console.log("log: " ,response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserRole = async () => {
    try {
      const { data: role } = await axios.get("http://localhost:3000/api/user/role",{ withCredentials: true });
        setUserRole(role);
        //console.log("This session user role:" ,role);
        //console.log(userRole);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/blog");
      const reversedBlogs = response.data.blogs.reverse();
 
      handleAccountBlogs(reversedBlogs);
      SetBlogs(reversedBlogs);
      console.log("Blogs:", reversedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleAccountBlogs = async (blogs) => {
    try {
      const emailPromises = blogs.map(async (blog) => {
        const { data: email } = await axios.get(`http://localhost:3000/api/blog/blogsListAccounts/${blog.user}`);
        return email.email;
      });

      const userEmails = await Promise.all(emailPromises);
      setBlogsAccount(userEmails);
      console.log("User Emails:", userEmails);
    } catch (error) {
      console.log(error);
    } 
  };

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
      const { data: fetchReasons } = await axios.get(
        "http://localhost:3000/api/user/reportReasons"
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

  const onClickgetblogId = async (blogId) => {
    navigate(`/post/${blogId}`);
    console.log("click get blog id:", blogId);
  };

  const onClicklikeblog = async (blogId) => {
    console.log("Clicked on blog with ID:", blogId);
    handleLikeBlog(blogId);
     setTimeout(() => {
       fetchBlogs();
     }, 250);
  };

  const handlePostBlog = async () => {
    await axios
      .post(`http://localhost:3000/api/blog/add`, {
        user: users,
        description: blogText,
      }).then(() => {
        setBlogText("");
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
    });
    fetchBlogs();
  };

  const handleLikeBlog = async (blogId) => {
    let temp = blogId;
    if (temp) {
      const text = `http://localhost:3000/api/blog/${temp}/like`;

      try {
        const response = await axios.put(text, {
          UserId: users,
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
        user: users,
        description: editedText,
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
    }, 500);
  };
 
  return (
    <div className="homepage">
      <Header />

      <Container className="padding-container">
        <div className="blog-section" style={{ position: "relative" }}>
          <textarea
            placeholder="Write your blog here..."
            value={blogText}
            onChange={(e) => setBlogText(e.target.value)}
            rows="10"
          />

          <button 
            onClick={handlePostBlog}
            style={{ position: "absolute", right: "12px", bottom: "30px" }}
          >
            Post Blog
          </button>
        </div>

        {Array.isArray(Blogs) &&
          Blogs.map((blog, index) => (

            <div key={blog._id} className="blog-item" >
              <div className="flex-div">
                <FontAwesomeIcon icon={faUser} />
                <strong style={{ marginLeft: '6px' }} className="flex-div"><i>{generateRandomNameForUserId(blog.user, blog._id)}</i>
                  {(userRole === "ADMIN") && ( <i style={{ marginLeft: '20px' }} >{blogsAccount[index] }</i> )}              
                </strong>
              </div>

              <hr class="solid"></hr>
              <p>{blog.description}</p>

              <div class="row">
                <div className="blog-icons">
                  <button onClick={() => onClicklikeblog(blog._id)}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                    {blog.likes.length}
                    &nbsp;
                    Like
                  </button>
                  <button onClick={() => AlertReport(blog._id)}>
                    <FontAwesomeIcon icon={faFlag} />
                    &nbsp;
                    Report
                  </button>

                  {blog.user === users && (
                    <button
                      onClick={() => {
                        AlertEdit(blog._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      &nbsp;
                      Edit
                    </button>
                  )}
                  <button onClick={() => {
                    onClickgetblogId(blog._id);
                  }}>
                    <FontAwesomeIcon icon={faComments} />
                    &nbsp;
                    comment
                  </button>


                  {((blog.user === users) || (userRole === "ADMIN")) && (
                  <button
                    onClick={() => {
                      AlertDelete(blog._id);
                    }}
                  >
                      <FontAwesomeIcon icon={faTrash} />
                      &nbsp;
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