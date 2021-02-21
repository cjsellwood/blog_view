import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import { Switch, Link, Route } from "react-router-dom";
import Post from "./components/Post";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const options = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const fetched = fetch("http://10.0.0.6:3000/posts", { options })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  let postsDisplay = [];
  if (posts.length) {
    postsDisplay = posts.map((post) => {
      if (!post.published) {
        return null;
      }
      return (
        <li key={post._id} className="post">
          <Link to={`/${post._id}`}>
            <h1>{post.title}</h1>
            <p className="date">{new Date(post.date).toLocaleDateString()}</p>
          </Link>
        </li>
      );
    });
  }

  // Save form values to state
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [comment, setComment] = useState({
    username: "",
    text: "",
  });

  const handleInput = (e) => {
    setComment({
      ...comment,
      [e.target.name]: e.target.value,
    });
  };

  // Submit comment form
  const addComment = (e) => {
    e.preventDefault();

    const id = e.target.getAttribute("data-id");

    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    };
    // Save new comment on server database
    fetch(`http://localhost:3000/posts/${id}/comment`, options)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        let index;
        // Find which post to add comment to and its index in state array
        const filteredPost = posts.filter((el, i) => {
          if (el._id === id) {
            index = i;
          }
          return el._id === id;
        })[0];

        // If successfully added to database add to react state
        if (data.status === "Success") {
          // Update state immutably
          const newPosts = [
            ...posts.slice(0, index),
            {
              ...filteredPost,
              comments: [
                ...filteredPost.comments,
                {
                  ...comment,
                  date: Date.now(),
                },
              ],
            },
            ...posts.slice(index),
          ];
          setPosts(newPosts);

          // Reset form
          setComment({
            username: "",
            text: "",
          });
        }
      });
  };

  return loading ? (
    <p>Loading</p>
  ) : (
    <div className="App">
      <Switch>
        <Route path="/:id">
          <Post
            posts={posts}
            addComment={addComment}
            handleInput={handleInput}
            comment={comment}
          />
        </Route>
        <Route exact path="/">
          <div className="title">
            <h1>Blog Posts</h1>
          </div>
          <ul>{postsDisplay}</ul>
        </Route>
      </Switch>
    </div>
  );
};

export default App;
