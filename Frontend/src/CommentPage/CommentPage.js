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
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleReportClick = () => {
    navigate("/report");
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
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/blog/659f854a2ad66c8e8baf64f0"
        );
        setBlogs([response.data.blog]);
        setBlogComment([response.data.blog._id]);
        setLikespost([response.data.blog.likes.length]);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  /*comment*/
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/comments/blogs/659f854a2ad66c8e8baf64f0"
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

    fetchComments();
  }, [blogComment]);

  /*addcomment */
  const handleAddComment = () => {
    axios
      .post(
        "http://localhost:3000/api/comments/blog/659f854a2ad66c8e8baf64f0/add",
        {
          user: users,
          description: newComment,
        }
      )
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

  return (
    <div className="comment-page">
      <Header />

      <Container className="flex-container">
        <Blog
          randomName="RandomName"
          cmuAccount="CMU@ACCOUNT"
          description="This is a sample blog post."
          likeCount={10}
          commentCount={5}
        />
        {/* Blog */}
        {Array.isArray(blogs) &&
          blogs.map((blog) => (
            <Blog
              key={blog._id}
              randomName={generateRandomNameForUserId(blog.user)}
              cmuAccount={blog.cmu_account}
              description={blog.description}
              likeCount={blog.likes.length}
              commentCount={blog.comments.length}
              onClickgetblogId={() => onClickgetblogId(blog._id)}
              togglePopup={togglePopup}
              showPopup={showPopup}
            />
          ))}
        {/* Comment List */}
        <br />
        <br />
        <br />
        <br />
        <br />
        <Comment
          randomName="RandomName"
          cmuAccount="CMU@ACCOUNT"
          description="This is a sample comment."
          likeCount={10}
        />

        {Array.isArray(comments) &&
          comments.map((comment) => (
            <Comment
              key={comment._id}
              randomName={generateRandomNameForUserId(comment.user)}
              cmuAccount={comment.cmu_account}
              description={comment.description}
              likeCount={comment.likes.length}
              onClickgetblogId={() => onClickgetblogId(comment._id)}
              togglePopup={togglePopup}
              showPopup={showPopup}
            />
          ))}

        {/* Comment Input */}
        <br />
        <br />
        <br />
        <br />
        <br />
        <CommentInput/>
        <div className="comment-input">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment}>Comment</button>
        </div>
      </Container>
    </div>
  );
};

export default CommentPage;
