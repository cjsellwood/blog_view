import React from "react";
import "./Post.css"
import { useState, useEffect } from "react";
import { useParams, withRouter } from "react-router-dom";

const Post = (props) => {
  const [post, setPost] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const filteredPost = props.posts.filter((el) => {
      return el._id === id;
    })[0];
    setPost(filteredPost);

  }, [])

  let comments = null;
  if (typeof post.title !== "undefined") {
    comments = post.comments.map(comment => {
      return (
        <li key={comment._id}>
          <p>{comment.username}</p>
          <p className="date">{new Date(comment.date).toLocaleDateString()}</p>
          <p className="comment-text">{comment.text}</p>
        </li>
      )
    })
  }

  return (
    <div className="Post">
      <h1 className="title">{post.title}</h1>
      <p className="date">{new Date(post.date).toLocaleDateString()}</p>
      <p>{post.text}</p>
      <h2 className="comment-title">Comments</h2>
      <ol className="comment-list">
        {comments}
      </ol>
    </div>
  );
};

export default withRouter(Post);
