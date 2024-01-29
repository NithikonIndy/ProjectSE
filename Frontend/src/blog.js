// Blog.js

import React from 'react';

const Blog = ({ blog, onClick }) => (
  <div className="blog" onClick={onClick}>
    <p>{blog.user}</p>
    <p>{blog.description}</p>
    {/* Add other blog content as needed */}
  </div>
);

export default Blog;
