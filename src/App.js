import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import { Switch, Link, Route } from "react-router-dom";
import Post from "./components/Post"

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

  return (
    loading ? <p>Loading</p> : 
    <div className="App">
      <Switch>
        <Route path="/:id">
          <Post posts={posts}/>

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
