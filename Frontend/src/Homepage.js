// Homepage.js
import React, { useState } from 'react';
import Header from './Header'; // Update the path accordingly
import './Homepage.css'; // Import your custom styles

const MessageContainer = ({ message }) => (
  <div className="message-container">
    {message}
  </div>
);

const BlogContentContainer = ({ content }) => (
  <div className="blog-content-container">
    {content}
  </div>
);

const Homepage = () => {
  const [blogText, setBlogText] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [blogLikes, setBlogLikes] = useState({}); // New state to keep track of likes for each blog
  const [postMessage, setPostMessage] = useState('');

  const handleBlogChange = (event) => {
    setBlogText(event.target.value);
  };

  const handlePostBlog = () => {
    // Check if blogText is not empty before creating a new blog
    if (blogText.trim() !== '') {
      const newBlog = {
        id: Date.now(), // Unique identifier (using timestamp)
        content: blogText,
      };

      setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
      setBlogLikes((prevLikes) => ({ ...prevLikes, [newBlog.id]: 0 })); // Initialize likes count to 0
      setBlogText('');
      setPostMessage('Blog posted successfully!'); // Set the success message
    } else {
      setPostMessage('Please enter a blog before posting.'); // Set an error message
    }
  };

  // Function to handle liking a blog
  const handleLikeBlog = (blogId) => {
    // Update the likes in the state
    setBlogLikes((prevLikes) => ({
      ...prevLikes,
      [blogId]: prevLikes[blogId] + 1,
    }));
  };

  return (
    <div className="homepage">
      <Header />
      {/* Add your homepage content here */}
      <h1>Blogs</h1>
      <div className="blog-section">
        <textarea
          placeholder="Write your blog here..."
          value={blogText}
          onChange={handleBlogChange}
        />
        <button onClick={handlePostBlog}>Post Blog</button>
        {/* Display post message */}
      </div>
      {/* Display existing blogs */}
      <div className="existing-blogs">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-item">
            <MessageContainer message={blog.content} />
            <button onClick={() => handleLikeBlog(blog.id)}>Like</button>
            {blogLikes[blog.id] > 0 && <span>{blogLikes[blog.id]} ❤️</span>}
          </div>
        ))}
      </div>
      {/* ...other content */}
    </div>
  );
};

export default Homepage;
