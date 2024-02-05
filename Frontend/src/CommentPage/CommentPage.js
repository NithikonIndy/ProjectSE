import React, { useState, useEffect } from "react";
import "./CommentPage.css";
import "../components/comment/comment.css";
import Header from "../Header/Header.js";
import "../components/blogs/blog.css"
import "../components/comment/comment.css";
import "../components/comment/commentInput.css";
import { uniqueNamesGenerator, animals } from "unique-names-generator";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardText,
  CardHeader,
  Container,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faFlag,
  faTrash,
  faComments,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";

const generateRandomNameForUserId = (userId, blogId) => {
  const seed = userId + blogId; // Use the user ID as the seed
  const config = {
    dictionaries: [animals],
    seed: seed,
  };

  return uniqueNamesGenerator(config);
};

const CommentPage = () => {
  const [comments, setComments] = useState([]);
  //const [commentText, setCommentText] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [users, setUsers] = useState([]);
  const [blogComment, setBlogComment] = useState([]);
  //const [clickedBlogId, setClickedBlogId] = useState([]);
  const [likespost, setLikespost] = useState();
  //const [clickedcommentId, setClickedcommentId] = useState([]);
  const blogIdforget = useParams().blogId;
  const [userRole, setUserRole] = useState([]);
  //const [blogText, setBlogText] = useState("");
  const [blogAccount, setBlogAccount] = useState("");
  const [commentAccount, setCommentAccount] = useState("");

  useEffect(() => {
    fetchBlogs();
    fetchSession();
    fetchUserRole();
    fetchComments();
    handleAccountBlog(blogIdforget);
    //handleAccountComment(userId);
    //console.log("Comments:", comments);
    console.log("User role:", userRole,"\n",
                "User session:", users[0] ,"\n",
                "blog-Comment:", blogComment, "\n",
                "User session:", users ,"\n",
                
    );
  }, [userRole], [users], [blogComment], [users[0]], [blogAccount], [commentAccount],);    
  
  const fetchSession = async () => {
    try {
      const response = await axios.get("http://localhost:3000/Userid", {withCredentials: true,});
      setUsers([response.data.user]);
    } catch (error) {
      console.error("Error fetching user session:", error);
    }
  };

  const fetchUserRole = async () => {
    try {
      const { data: role } = await axios.get("http://localhost:3000/session",{ withCredentials: true });
        setUserRole(role);
        //console.log(role);
        //console.log(userRole);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
  };

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

  const handleReportReasons = async() => {
    try {
      const { data: fetchReasons } = await axios.get("http://localhost:3000/reportReasons");
      console.log(fetchReasons);
      return fetchReasons;
    } catch (error) {
      console.error(error);
    }
  };

  const handleReport = async (blogid, selectReason) => {
    const reason = selectReason;
    console.log(`reason:`, reason);
    try {
      await axios.post(`http://localhost:3000/api/blog/${blogid}/report`, { reason }, { withCredentials: true });
    } catch (error) {
      console.error(error);
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
    const apiurl = `http://localhost:3000/api/blog/${blogId}`;
    axios
      .delete(apiurl)
      .then((response) => {
        console.log("Delete successful", response.data);
      })
      .catch((error) => {
        console.error("Error deleting resource", error);
      });
  };

  const handleDeleteComment = (commentid) => {
    const apiurl = `http://localhost:3000/api/comments/blog/${commentid}`;
    axios
      .delete(apiurl)
      .then((response) => {
        console.log("Delete successful", response.data);
      })
      .catch((error) => {
        console.error("Error deleting resource", error);
      });
      setTimeout(() => {
        fetchComments();
      }, 500);
  };

  const handleEditComment = (commentid, editedText) => {
    const apiurl = `http://localhost:3000/api/comments/update/${commentid}`;
    axios
      .put(apiurl, {
        user: users[0],
        description: editedText,
      })
      .then((response) => {
        setComments(...comments, response.data.comment);
        //setCommentText("");
        console.log("Edit successful", response.data);
      })
      .catch((error) => {
        console.error("Error editing comment", error);
      });
    setTimeout(() => {
      fetchComments();
    }, 400);
  };

  const handleAccountBlog = async (blogid) => {
    try {
      const { data: fetchAccountBlog } = await axios.get(`http://localhost:3000/api/blog/${blogid}/account`);
      //console.log("Cmu account:", fetchAccount);
      console.log("Account:", fetchAccountBlog);
      //return fetchAccountBlog;
      setBlogAccount(fetchAccountBlog.email);
    } catch (error) {
      console.log("Error fetching account:", error);
    }
  };

  const handleAccountComment = async (userId) => {
    try {
      const { data: fetchAccountComment } = await axios.get(`http://localhost:3000/api/comments/blog/${userId}/account`);
      console.log("Account:", fetchAccountComment);
      //return fetchAccountComment;
      setCommentAccount(fetchAccountComment.email);
    } catch (error) {
      console.log("Error fetching account:", error);
    }
  };
  
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
      const fetchReasons = await handleReportReasons();
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
              console.log("inputValidator:", result);
              return !result && "You need to select the reason!";
            },
          });
          if (reasons) {
            // fetch the POST reasons from the backend
            console.log(`reasons[${reasons}]`);
            await handleReport(blogid, fetchReasons[reasons])
            Swal.fire({
              title: "Report!",
              text: `Your report reason[${reasons}] has submitted.`,
              icon: "success",
            });
          }
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
          //setBlogText(editedText); // Set the edited text to the state
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

  const AlertEditComment = (commentid) => {
    Swal.fire({
      title: "Enter text",
      input: "text",
      inputLabel: "Your text",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const editedText = result.value;
        if (editedText) {
          //setCommentText(editedText); // Set the edited text to the state
          Swal.fire({
            title: "Edit!",
            text: `Your comment has been edited.`,
            icon: "success",
          });
          console.log("edit comment text's: ",editedText);
          handleEditComment(commentid, editedText); // Pass the edited text to handleEditBlog
        }
      }
    });
  };

  const onClickgetblogId = async (blogId) => {
    console.log("Clicked on blog with ID:", blogId);
    //setClickedBlogId(blogId); // Store the clicked blogId in state
    likePost(blogId); // Call likePost with the blogId
    setTimeout(() => {
      fetchlike(blogId);
    }, 250);
  };

  const onClickgetcommentId = async (commentId) => {
    console.log("Clicked on Comment with ID:", commentId);
    //setClickedcommentId(commentId);
    likecoment(commentId);
    setTimeout(() => {
      fetchComments();
    }, 250);
  };

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
                    <strong><i>{generateRandomNameForUserId(blog.user, blog._id)}</i></strong>
                    { userRole === "ADMIN" && (
                      <strong style={{ marginLeft: '10px' }}>{blogAccount}</strong>
                    )}    
                  </div>

                  <div className="topright">
                    {blog.user === users[0] && (
                      <Button
                        className="logo-control"
                        id={`editButton-${blog._id}`}
                        onClick={() => {
                          AlertEdit(blog._id);
                          setTimeout(() => {
                            fetchBlogs();
                          }, 1000);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    )}

                    {blog.user === users[0] && (
                      <Button
                        className="logo-control"
                        id={`deleteButton-${blog.user}`}
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
                  </div>
                </CardHeader>

                <CardText>{blog.description}</CardText>

                <CardFooter>
                  <div className="flex-div">
                    <p>
                      <Button
                        className="logo-control"
                        onClick={() => {
                          onClickgetblogId(blog._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faThumbsUp} />
                        {likespost}
                      </Button>
                    </p>

                    <p>
                      <Button className="logo-control">
                        <FontAwesomeIcon icon={faComments} />
                        {blog.comments.length}
                      </Button>
                    </p>
                  </div>
                  <Button
                    className="logo-control"
                    onClick={() => {
                      AlertReport(blog._id);
                    }}
                  >
                    <FontAwesomeIcon icon={faFlag} />
                  </Button>
                </CardFooter>
              </CardBody>
            </Card>
          ))}

        {/* Comment List */}
        {Array.isArray(comments) &&
          comments.map((comment) => (
            <Card className="adjust-width margin-bottom" key={comment._id}>
              <CardBody>
                <CardHeader>
                  <div className="flex-div">
                    <p>
                      {generateRandomNameForUserId(comment.user, comment.blog)}
                    </p>
                    <p>{/*commentAccount*/comment.user}</p>
                  </div>

                  <div className="topright">
                    {comment.user === users[0] && (
                      <Button
                        id={`editButtonComment-${comment.user}`}
                        onClick={() => {
                          AlertEditComment(comment._id);
                          setTimeout(() => {
                            fetchBlogs();
                          }, 1000);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    )}

                    {((comment.user === users[0]) || (userRole === "ADMIN")) && (
                      <Button
                        className="logo-control"
                        id={`deleteButtoncomment-${comment.user}`}
                        onClick={() => {
                          AlertDeleteComment(comment._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardText>{comment.description}</CardText>

                <CardFooter>
                  <div className="flex-div">
                    <Button
                      onClick={() => {
                        onClickgetcommentId(comment._id);
                      }}
                      style={{ backgroundColor: '#2CD5BD', color: 'white' }}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} />
                      {comment.likes ? comment.likes.length : 0}
                    </Button>
                  </div>
                  {/*
                  <Button
                    onClick={() => {
                      AlertReport(comment._id);
                    }}
                  >
                    <FontAwesomeIcon icon={faFlag} />
                  </Button>
                  */}
                </CardFooter>
              </CardBody>
            </Card>
          ))}

        {/*<CommentInput />*/}
        <Card className="adjust-width">
          <CardBody>
            <CardText className="text-padding adjust-height">
              <textarea
                className="textarea-control"
                type="text"
                placeholder="Comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </CardText>
            <CardFooter>
              <div className="margin-left">
                <Button className = "logo-control" onClick={handleAddComment}>COMMENT</Button>
              </div>
            </CardFooter>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default CommentPage;
