import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CommentPage.css";
import Header from "../Header/Header.js";
import { uniqueNamesGenerator, Config, animals } from "unique-names-generator";
import { set } from "mongoose";
import Blog from "../components/blogs/Blog.js";
import Comment from "../components/comment/Comment.js";
import CommentInput from "../components/comment/CommentInput.js";
import { Container } from "react-bootstrap";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardText,
  CardHeader,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faFlag,
  faTrash,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

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
  const [newComment, setNewComment] = useState("");
  const [users, setUsers] = useState([]);
  const [blogComment, setBlogComment] = useState([]);
  const [clickedBlogId, setClickedBlogId] = useState([]);
  const [likespost, setLikespost] = useState();
  const [clickedcommentId, setClickedcommentId] = useState([]);
  const navigate = useNavigate();
  const blogIdforget = useParams().blogId;


  const AlertDelete = (blogid) => {
    Swal.fire({
      title: " blog Firmly to delete?",
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

  const AlertDeleteComment = (commentid) => {
    Swal.fire({
      title: "commnet Firmly to delete?",
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
        handleDeleteComment(commentid);
      }
    });
  };

  const AlertReport = async (blogid) => {
    try {
      // deconstruct the response to get the data //* console.log(fetchReasons); *//
      const { data : fetchReasons } = await axios.get("http://localhost:3000/reportReasons");
      console.log(fetchReasons);
      console.log(blogid);

      Swal.fire({
        title: "Firmly to report?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, report it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          //console.log(blogs[0]._id);
          //console.log(users[0]);
          const { value: reasons } = await Swal.fire({
            title: "Please select your reasons",
            input: "select",
            inputOptions: fetchReasons,
            inputPlaceholder: "Please select your reasons",
            showCancelButton: true,
            inputValidator: (result) => {
              console.log("inputValidator:" ,result);
              return !result && "You need to select the reason!";
            },
          });
          if (reasons) {
            // fetch the POST reasons from the backend
            console.log(`reasons[${reasons}]`);
            try {
              const reason = fetchReasons[reasons];
              console.log(`reasons ${reason}`);
              await axios.post(`http://localhost:3000/api/blog/${blogid}/report`, {reason} , {withCredentials: true});
            }catch(error) {
              console.error(error);
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
    console.log("Clicked on blog with ID:", blogId);
    setClickedBlogId(blogId); // Store the clicked blogId in state
    likePost(blogId); // Call likePost with the blogId
    setTimeout(() => {
      fetchlike(blogId);
    }, 250);
  };

  const onClickgetcommentId = async (commentId) => {
    console.log("Clicked on Comment with ID:", commentId);
    setClickedcommentId(commentId);
    likecoment(commentId);
    setTimeout(() => {
      fetchComments();
    }, 250);
  };

  const showdeletebuttons = (UserId) => {
    const isBlogOwner = UserId === users[0];
    const buttonToToggle = document.getElementById(`deleteButton-${UserId}`);

    if (buttonToToggle) {
      buttonToToggle.style.display = isBlogOwner ? "block" : "none";
    }

  };

  const showdeletebuttonsforcomment = (UserId) => {
    const isBlogOwner = UserId === users[0];
    const buttonToToggle = document.getElementById(`deleteButtoncomment-${UserId}`);

    if (buttonToToggle) {
      buttonToToggle.style.display = isBlogOwner ? "block" : "none";
    }

  };



  /*Userid */
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
  /*one blog */
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/blog/${blogIdforget}`
      );

      setBlogs([response.data.blog]);
      setBlogComment([response.data.blog._id]);
      setLikespost([response.data.blog.likes.length]);


    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  /*comment*/
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/comments/blogs/${blogIdforget}`
        );
        let i = 0;
        let end = response.data.blogcomments.length;
        const accumulatedComments = [];

        while (i < end) {
          if (response.data.blogcomments[i].blog == blogComment) {
            accumulatedComments.push(response.data.blogcomments[i]);
          }
          i++;
        }
        //console.log(response.data);
        setComments(accumulatedComments);
      } catch (err) {
        console.log("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [blogComment]);

  /*addcomment */
  const handleAddComment = () => {
    axios
      .post(`http://localhost:3000/api/comments/blog/${blogIdforget}/add`, {
        user: users,
        description: newComment,
      })
      .then((response) => {
        setComments([...comments, response.data.comment]);
        setNewComment("");
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
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
      console.log("No blogId available");
    }
  };

  const fetchlike = async (blogId) => {
    // Fetch likes separately, if needed
    let temp = blogId;
    let text = `http://localhost:3000/api/blog/${temp}`;
    try {
      const response = await axios.get(text);
      setLikespost(response.data.blog.likes.length);
    } catch (err) {
      console.log("Error fetching likes:", err);
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

  const handleDeleteBlog = (blogId) => {
    const apiurl = `http://localhost:3000/api/blog/${blogId}`
    axios.delete(apiurl)
      .then(response => {
        console.log('Delete successful', response.data);
      })
      .catch(error => {
        console.error('Error deleting resource', error);
      });
  };

  const handleDeleteComment = (commentid) => {
    const apiurl = `http://localhost:5000/api/comments/blog/${commentid}`;
    axios.delete(apiurl)
      .then(response => {
        console.log('Delete successful', response.data);
      })
      .catch(error => {
        console.error('Error deleting resource', error);
      });
  }




  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/comments/blogs/659f854a2ad66c8e8baf64f0`
      );
      let i = 0;
      let end = response.data.blogcomments.length;
      const accumulatedComments = [];

      while (i < end) {
        if (response.data.blogcomments[i].blog == blogComment) {
          accumulatedComments.push(response.data.blogcomments[i]);
        }
        i++;
      }

      setComments(accumulatedComments);
    } catch (err) {
      console.log("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    showdeletebuttons(users[0]);
    showdeletebuttonsforcomment(users[0]);
  }, [users[0]]);


  return (
    <div className="comment-page">
      <Header />

      <Container className="flex-container">
        {/* Blog */}
        {Array.isArray(blogs) &&
          blogs.map((blog) => (
            <Card key={blog._id}>
              <CardBody>
                <CardHeader>
                  <div className="flex-div">
                    <p>{generateRandomNameForUserId(blog.user)}</p>
                    <p>{blog.user}</p>
                  </div>
                  {blog.user === users[0] && (
                    <Button id={`deleteButton-${blog.user}`}
                      onClick={() => {
                        AlertDelete(blog._id);
                        setTimeout(() => {
                          fetchBlogs();
                        }, 500);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  )}
                </CardHeader>

                <CardText>{blog.description}</CardText>

                <CardFooter>
                  <div className="flex-div">
                    <p>
                      <Button
                        onClick={() => {
                          onClickgetblogId(blog._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faThumbsUp} />
                        {likespost}
                      </Button>
                    </p>

                    <p>
                      <Button>
                        <FontAwesomeIcon icon={faComments} />
                        {blog.comments.length}
                      </Button>
                    </p>
                  </div>
                  <Button

                    onClick={() => {
                      AlertReport(blog._id)
                    }}
                  >
                    <FontAwesomeIcon icon={faFlag} />
                  </Button>
                </CardFooter>
              </CardBody>
            </Card>
          ))}

        {/* Comment List */}
        <br />
        <br />

        {Array.isArray(comments) &&
          comments.map((comment) => (
            <Card className="adjust-width margin-bottom" key={comment._id}>
              <CardBody>
                <CardHeader>
                  <div className="flex-div">
                    <p>{generateRandomNameForUserId(comment.user)}</p>
                    <p>{comment.user}</p>
                  </div>
                  {comment.user === users[0] && (
                  <Button id={`deleteButtoncomment-${comment.user}`}
                    onClick={() => {
                      AlertDeleteComment(comment._id);
                      setTimeout(() => {
                        fetchBlogs();
                      }, 500);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  )}
                </CardHeader>

                <CardText>{comment.description}</CardText>

                <CardFooter>
                  <div className="flex-div">
                    <Button
                      onClick={() => {
                        onClickgetcommentId(comment._id);
                      }}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} />
                      {comment.likes ? comment.likes.length : 0}
                    </Button>
                  </div>
                  <Button onClick={() => {
                    AlertReport(comment._id);
                  }}>
                    <FontAwesomeIcon icon={faFlag} />
                  </Button>
                </CardFooter>
              </CardBody>
            </Card>
          ))}

        <br />
        <br />
        {/*<CommentInput />*/}
        <Card className="adjust-width">
          <CardBody>
            <CardText className="text-padding adjust-height">
              <textarea
                type="text"
                placeholder="Comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </CardText>
            <CardFooter>
              <div className="margin-left">
                <Button onClick={handleAddComment}>COMMENT</Button>
              </div>
            </CardFooter>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default CommentPage;
