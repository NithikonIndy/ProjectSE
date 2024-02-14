import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import axios from "axios";
import { uniqueNamesGenerator, animals } from "unique-names-generator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faFlag, faEdit } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  faBell,
  faHome,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const generateRandomNameForUserId = (userId, blogId) => {
  const seed = userId + blogId; // Use the user ID as the seed
  const config = {
    dictionaries: [animals],
    seed: seed,
  };

  return uniqueNamesGenerator(config);
};

const YourBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

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
    navigate(`/post/${blogId}`);
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
      setBlogs(Blog);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="your-blog">
      <Header />

      <Container className="padding-container">
        {Array.isArray(blogs) &&
          blogs.map((blog) => (
            <div key={blog._id} className="blog-item">
              <div class="row">
                <div>
                  <FontAwesomeIcon icon={faUser} />
                  <strong style={{ marginLeft: '6px' }}><i>{generateRandomNameForUserId(blog.user, blog._id)}</i></strong>
                  <p>{blog.description}</p>
                </div>
              </div>
              <div class="row">
                <div className="blog-icons">
                  <button onClick={() => onClickgetblogId(blog._id)}>
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
      </Container>
    </div>
  );
};

export default YourBlog;
