// Blog.js
import React from 'react';

const Blog = ({ post, onLike, onDislike }) => (
  <div className="blog-item">
    <p>{post.content}</p>
    <div className="like-section">
      <button onClick={onLike}>Like</button>
      <button onClick={onDislike}>Dislike</button>
      {post.likes > 0 && <span>{post.likes} ❤️</span>}
      {post.dislikes > 0 && <span>{post.dislikes} 👎</span>}
    </div>
  </div>
);

export default Blog;
