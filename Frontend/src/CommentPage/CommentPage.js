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
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const generateRandomNameForUserId = (userId, blogId) => {
  const seed = userId + blogId;
  const config = {
    dictionaries: [animals],
    seed: seed,
  };
  return uniqueNamesGenerator(config);
};

const CommentPage = () => {
  const [users, setUsers] = useState("");
  const [userRole, setUserRole] = useState([]);
  const [blog, setBlog] = useState([]);
  const [listComment, setListComment] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [listLikePost, setListLikePost] = useState([]);
  const blogIdforget = useParams().blogId;
  const [blogAccount, setBlogAccount] = useState("");
  const [commentAccount, setCommentAccount] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSession();
    fetchBlog();
    fetchComments();
  }, []);

  const fetchSession = async () => {
    try {
      const response = await axios.get("https://backend-b1ep.onrender.com/api/user/status", {
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
      const response = await axios.get("https://backend-b1ep.onrender.com/api/user/deleteSession", {
        withCredentials: true,
      });
      console.log("log: " ,response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserRole = async () => {
    try {
      const { data: role } = await axios.get("https://backend-b1ep.onrender.com/api/user/role",{ withCredentials: true });
        setUserRole(role);
        //console.log("This session user role:" ,role);
        //console.log(userRole);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://backend-b1ep.onrender.com/api/comments/blogs/${blogIdforget}`);
      //console.log(response.data.commentsList);
      //console.log(response.data.commentsList.length);
      const reverseCommentsList = response.data.commentsList.reverse();

      handleAccountComment(reverseCommentsList);
      setListComment(reverseCommentsList);
    } catch (err) {
      console.log("Error fetching comments:", err);
    }
  };

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`https://backend-b1ep.onrender.com/api/blog/${blogIdforget}`);
      setBlog([response.data.blog]);
      handleAccountBlog(blogIdforget);
      fetchLikesPost();
    } catch (error) {
      console.error("Error fetching blog:", error);
    }

    console.log("FetchingBlog");
  };

  const handleReportReasons = async () => {
    try {
      const { data: fetchReasons } = await axios.get("https://backend-b1ep.onrender.com/api/user/reportReasons");
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
      await axios.post(`https://backend-b1ep.onrender.com/api/blog/${blogid}/report`, { reason }, { withCredentials: true });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditBlog = (blogId, editedText) => {
    const apiurl = `https://backend-b1ep.onrender.com/api/blog/update/${blogId}`;
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
      fetchBlog();
    }, 400);
  };

  const handleAddComment = () => {
    axios
      .post(`https://backend-b1ep.onrender.com/api/comments/blog/${blogIdforget}/add`, {
        user: users,
        description: newComment,
      })
      .then(() => {
        setNewComment("");
        fetchComments();
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  const handleLikePost = async () => {
    const apiUrl = `https://backend-b1ep.onrender.com/api/blog/${blogIdforget}/like`;
    try {
      const response = await axios.put(apiUrl, { UserId : users });
        if (response.data === "The post has been liked" || response.data === "The post has been disliked") {
          fetchLikesPost();
        }
        console.log("handleLikePost" ,response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLikesPost = async () => {
    try {
      const response = await axios.get(`https://backend-b1ep.onrender.com/api/blog/${blogIdforget}`);
      let i = 0;
      let end = response.data.blog.likes.length;
      const arrayLikes = [];

      while (i < end) {
        if (response.data.blog._id == blogIdforget) {
          arrayLikes.push(response.data.blog.likes[i]);
        }
        i++;
      }
      setListLikePost(arrayLikes);

    } catch (err) {
      console.log("Error fetching likes:", err);
    }

    console.log("FetchingLikesPost");
  };

  const handleLikeComment = async (commentId) => {
    const apiUrl = `https://backend-b1ep.onrender.com/api/comments/blog/${commentId}/like`;
    try {
      const response = await axios.put(apiUrl, { userId: users });
      if(response.data === "The comment has been liked" || response.data === "The comment has been disliked"){
        fetchComments(commentId);
      }
      console.log("handleLikeComment", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBlog = (blogId) => {
    const apiurl = `https://backend-b1ep.onrender.com/api/blog/${blogId}`;
    axios
      .delete(apiurl)
      .then((response) => {
        console.log("Delete successful", response.data);
      })
      .catch((error) => {
        console.error("Error deleting resource", error);
      });
      setTimeout(() => {
        onClickGotoHome();
      }, 100);
  };

  const handleDeleteComment = (commentid) => {
    const apiurl = `https://backend-b1ep.onrender.com/api/comments/blog/${commentid}`;
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
    const apiurl = `https://backend-b1ep.onrender.com/api/comments/update/${commentid}`;
    axios
      .put(apiurl, {
        user: users,
        description: editedText,
      })
      .then((response) => {
        setListComment(...listComment, response.data.comment);
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
      const { data: fetchAccountBlog } = await axios.get(`https://backend-b1ep.onrender.com/api/blog/${blogid}/account`);
      //console.log("Cmu account:", fetchAccount);
      // console.log("Blog account:", fetchAccountBlog);
      //return fetchAccountBlog;
      setBlogAccount(fetchAccountBlog.email);
    } catch (error) {
      console.log("Error fetching account:", error);
    }

    console.log("FetchingAccountBlog");
  };

  const handleAccountComment = async (comments) => {
    try {
      const emailPromises = comments.map(async (comment) => {
        const { data: email } = await axios.get(`https://backend-b1ep.onrender.com/api/comments/blog/${comment.user}/account`);
        //console.log("handleAccountComment", comment.user);
        return email.email;
      });
      const userEmails = await Promise.all(emailPromises);
      setCommentAccount(userEmails);
      console.log("Comment account:", userEmails);
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
          //console.log(users);
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
          Swal.fire({
            title: "Edit!",
            text: `Your post has been edited.`,
            icon: "success",
          });
          handleEditBlog(blogid, editedText);
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
          Swal.fire({
            title: "Edit!",
            text: `Your comment has been edited.`,
            icon: "success",
          });
          console.log("edit comment text's: ", editedText);
          handleEditComment(commentid, editedText);
        }
      }
    });
  };

  const onClickGotoHome = async () => {
    navigate(`/home`);
    // console.log("click get blog id:", blogId);
  };

  return (
    <div className="comment-page">
      <Header />

      <Container className="flex-container">
        {/* Blog */}
        {Array.isArray(blog) &&
          blog.map((blog) => (
            <Card key={blog._id}>
              <CardBody>
                <CardHeader>
                  <div className="flex-div">
                    <FontAwesomeIcon icon={faUser} />
                    <strong style={{ marginLeft: '6px' }}><i>{generateRandomNameForUserId(blog.user, blog._id)}</i></strong>
                    {userRole === "ADMIN" && (
                      <strong style={{ marginLeft: '10px' }}>{blogAccount}</strong>
                    )}
                  </div>

                  <div className="topright">
                    {blog.user === users && (
                      <Button
                        className="logo-control"
                        onClick={() => {
                          AlertEdit(blog._id);
                          setTimeout(() => {
                            fetchBlog();
                          }, 1000);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        &nbsp;
                        Edit
                      </Button>
                    )}

                    {blog.user === users && (
                      <Button
                        className="logo-control"
                        id={`deleteButton-${blog.user}`}
                        onClick={() => {
                          AlertDelete(blog._id);
                          setTimeout(() => {
                            fetchBlog();
                          }, 500);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        &nbsp;
                        Delete
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
                          handleLikePost();
                        }}
                      >
                        <FontAwesomeIcon icon={faThumbsUp} className="margin-right" />
                        {listLikePost.length}
                        &nbsp;
                        Like
                      </Button>
                    </p>

                     {/* <p>
                      <Button className="logo-control">
                        <FontAwesomeIcon icon={faComments} />
                        { {blog.comments.length} }
                        &nbsp;
                      Comment
                      </Button>
                    </p>  */}
                  </div>
                  <Button
                    className="logo-control"
                    onClick={() => {
                      AlertReport(blog._id);
                    }}
                  >
                    <FontAwesomeIcon icon={faFlag} />
                    &nbsp;
                    Report
                  </Button>
                </CardFooter>
              </CardBody>
            </Card>
          ))}

        {<CommentInput />}
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
                <Button className="logo-control" onClick={handleAddComment}>COMMENT</Button>
              </div>
            </CardFooter>
          </CardBody>
        </Card>

        {/* Comment List */}
        {Array.isArray(listComment) &&
          listComment.map((comment, index) => (
            <Card key={comment.id} className="adjust-width margin-bottom" >
              <CardBody>
                <CardHeader>
                  <div className="flex-div">
                    <FontAwesomeIcon icon={faUser} />
                    <strong style={{ marginLeft: '6px' }}><i>{generateRandomNameForUserId(comment.user, comment.blog)}</i></strong>

                    {(userRole === "ADMIN") && (
                      <p style={{ marginLeft: '6px' }} >{commentAccount[index]}</p>
                    )}
                  </div>

                  <div className="topright">
                    {comment.user === users && (
                      <Button
                        className="logo-control"
                        onClick={() => {
                          AlertEditComment(comment.id);
                          setTimeout(() => {
                            fetchBlog();
                          }, 1000);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        &nbsp;
                        Edit
                      </Button>
                    )}

                    {((comment.user === users) || (userRole === "ADMIN")) && (
                      <Button
                        className="logo-control"
                        onClick={() => {
                          AlertDeleteComment(comment.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        &nbsp;
                        Delete
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardText>{comment.description}</CardText>

                <CardFooter>
                  <div className="flex-div">
                    <Button
                      onClick={() => {
                        handleLikeComment(comment.id);
                        console.log("Comment id", comment.id);
                      }}
                      style={{ backgroundColor: '#2CD5BD', color: 'white' }}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} className="margin-right" />
                      {comment.likes.length}
                      &nbsp;
                      Like
                    </Button>
                  </div>
                  {/*
                  <Button
                    className="logo-control"
                    onClick={() => {
                      AlertReport(comment._id);
                    }}
                  >
                    <FontAwesomeIcon icon={faFlag} />
                    &nbsp;
                    Report
                  </Button>
                  */}
                </CardFooter>
              </CardBody>
            </Card>
          ))}


      </Container>
    </div>
  );
};

export default CommentPage;
