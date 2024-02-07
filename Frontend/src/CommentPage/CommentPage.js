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

const generateRandomNameForUserId = (userId, blogId) => {
  const seed = userId + blogId; // Use the user ID as the seed
  const config = {
    dictionaries: [animals],
    seed: seed,
  };
  return uniqueNamesGenerator(config);
};

const CommentPage = () => {
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState([]);

  const [blog, setBlog] = useState([]);
  const [listComment, setListComment] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [listLikePost, setListLikePost] = useState([]);

  const blogIdforget = useParams().blogId;

  const [blogAccount, setBlogAccount] = useState("");
  const [commentAccount, setCommentAccount] = useState([]);

  useEffect(() => {
    fetchBlog();
    fetchSession();
    fetchUserRole();
    fetchComments();
    fetchLikesPost();
    handleAccountBlog(blogIdforget);

    if (listComment.length > 0) {
      const userIdList = listComment.map(comment => comment.user);
      handleAccountComment(userIdList);
    }

    console.log("User role:", userRole,"\n",
                "User session:", users[0] ,"\n",
                "User session:", users ,"\n",
                "Blog:", blog, "\n",
                "ListComment:", listComment, "\n",
                "ListLikePost:", listLikePost, "\n",
          
    );
  }, [userRole], [users], [listComment], [blog], [listLikePost], [commentAccount], [newComment]);

  
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
      const response = await axios.get(`http://localhost:3000/api/comments/blogs/${blogIdforget}`);
      let i = 0;
      let end = response.data.blogcomments.length;
      const arrayComments = [];

      while (i < end) {
        if (response.data.blogcomments[i].blog == blogIdforget) {
          arrayComments.push(response.data.blogcomments[i]);
        }
        i++;
      }
      //console.log(response.data);
      setListComment(arrayComments);
    } catch (err) {
      console.log("Error fetching comments:", err);
    }
  };

  /*Topic Blog */
  const fetchBlog = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/blog/${blogIdforget}`);
      setBlog([response.data.blog]);
      //setListLikePost([response.data.blog.likes.length]);
    } catch (error) {
      console.error("Error fetching blog:", error);
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
      .post(`http://localhost:3000/api/comments/blog/${blogIdforget}/add`, {
        user: users[0],
        description: newComment,
      })
      .then((response) => {
        setListComment([...listComment, response.data.comment]);
        setNewComment("");
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  const handleLikePost = async () => {
    const apiUrl = `http://localhost:3000/api/blog/${blogIdforget}/like`;
    try {
      const response = await axios.put(apiUrl, { UserId : users[0] });
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
      const response = await axios.get(`http://localhost:3000/api/blog/${blogIdforget}`);
      let i = 0;
      let end = response.data.blog.likes.length;
      const arrayLikes = [];

      while(i < end){
        if(response.data.blog._id == blogIdforget){
          arrayLikes.push(response.data.blog.likes[i]);
        }
        i++;
      }
      setListLikePost(arrayLikes);

    } catch (err) {
      console.log("Error fetching likes:", err);
    }
  };

  const handleLikeComment = async (commentId) => {
    const apiUrl = `http://localhost:3000/api/comments/blog/${commentId}/like`;
    try {
      const response = await axios.put(apiUrl, { userId: users[0] });
      if(response.data === "The comment has been liked" || response.data === "The comment has been disliked"){
        fetchComments(commentId);
      }
      console.log("handleLikeComment" ,response.data);
    } catch (error) {
      console.log(error);
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
      const { data: fetchAccountBlog } = await axios.get(`http://localhost:3000/api/blog/${blogid}/account`);
      //console.log("Cmu account:", fetchAccount);
      // console.log("Blog account:", fetchAccountBlog);
      //return fetchAccountBlog;
      setBlogAccount(fetchAccountBlog.email);
    } catch (error) {
      console.log("Error fetching account:", error);
    }
  };

  const handleAccountComment = async (userIdList) => {
    try {
        const emailPromises = userIdList.map(async userId => {
            const { data: email } = await axios.get(`http://localhost:3000/api/comments/blog/${userId}/account`);
            return email.email;
        });
        const userEmails = await Promise.all(emailPromises);
        setCommentAccount(commentAccount => [...commentAccount, ...userEmails]);
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
                            fetchBlog();
                          }, 1000);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        &nbsp;
                        Edit
                      </Button>
                    )}

                    {/* {blog.user === users[0] && (
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
                    )} */}
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
                        <FontAwesomeIcon icon={faThumbsUp} className="margin-right"/>
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

        {/* Comment List */}
        {Array.isArray(listComment) &&
          listComment.map((comment, index) => (
            <Card className="adjust-width margin-bottom" key={comment._id}>
              <CardBody>
                <CardHeader>
                  <div className="flex-div">
                    <FontAwesomeIcon icon={faUser} />
                    <strong style={{ marginLeft: '6px' }}><i>{generateRandomNameForUserId(comment.user, comment.blog)}</i></strong>
                    
                    {(userRole === "ADMIN") && (
                      <p style={{ marginLeft: '6px' }} >{commentAccount[index] }</p>
                    )}
                  </div>

                  <div className="topright">
                    {comment.user === users[0] && (
                      <Button
                        className="logo-control"
                        id={`editButtonComment-${comment.user}`}
                        onClick={() => {
                          AlertEditComment(comment._id);
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

                    {((comment.user === users[0]) || (userRole === "ADMIN")) && (
                      <Button
                        className="logo-control"
                        id={`deleteButtoncomment-${comment.user}`}
                        onClick={() => {
                          AlertDeleteComment(comment._id);
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
                        handleLikeComment(comment._id);
                        console.log("Comment id", comment._id);
                      }}
                      style={{ backgroundColor: '#2CD5BD', color: 'white' }}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} className="margin-right"/>
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
                <Button className="logo-control" onClick={handleAddComment}>COMMENT</Button>
              </div>
            </CardFooter>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default CommentPage;
