// Homepage.js
import React, { useState } from 'react';
import Header from './Header'; // Update the path accordingly
import './Homepage.css'; // Import your custom styles
import Blog from './Blog'; // Import the new Blog component

const Homepage = () => {
  const [blogText, setBlogText] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [blogLikes, setBlogLikes] = useState({}); // New state to keep track of likes for each blog

  const handleBlogChange = (event) => {
    setBlogText(event.target.value);
  };

  const handlePostBlog = () => {
    // Check if blogText is not empty before creating a new blog
    if (blogText.trim() !== '') {
      const newBlog = {
        id: Date.now(), // Unique identifier (using timestamp)
        content: blogText,
        likes: 0, // Initialize likes count to 0
        dislikes: 0, // Initialize dislikes count to 0
      };

      setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
      setBlogText('');
    }
  };

  const handleLikeBlog = (blogId) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === blogId
          ? { ...blog, likes: blog.likes + 1, dislikes: 0 } // Reset dislikes when liking
          : blog
      )
    );
  };

  const handleDislikeBlog = (blogId) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === blogId
          ? { ...blog, dislikes: blog.dislikes + 1, likes: 0 } // Reset likes when disliking
          : blog
      )
    );
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
      </div>
      {/* Display existing blogs */}
      <div className="existing-blogs">
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            onLike={() => handleLikeBlog(blog.id)}
            onDislike={() => handleDislikeBlog(blog.id)}
          />
        ))}
      </div>
      {/* ...other content */}
    </div>
  );
};

export default Homepage;
