import React from 'react';

const Blog = ({ blog, onLike, onDislike }) => (
  <div className="blog-item">
    <p>{blog.content}</p>
    <div className="like-section">
      <button onClick={onLike}>Like</button>
      <button onClick={onDislike}>Dislike</button>
      {blog.likes > 0 && <span>{blog.likes} ❤️</span>}
      {blog.dislikes > 0 && <span>{blog.dislikes} 👎</span>}
    </div>
  </div>
);
