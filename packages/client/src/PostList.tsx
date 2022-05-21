import axios from "axios";
import React, { useEffect, useState } from "react";

import type { IPosts } from "@ms/posts/src/post.zod";

import { CommentCreate } from "./CommentCreate";
import { CommentList } from "./CommentList";

export function PostList() {
  const [posts, setPosts] = useState<IPosts>({});

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:4000/posts");

    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map(post => (
    <div className="card" style={{ width: "30%", marginBottom: "20px" }} key={post.id}>
      <div className="card-body">
        <h3>{post.title}</h3>
        <CommentList postId={post.id} />
        <CommentCreate postId={post.id} />
      </div>
    </div>
  ));

  return <div className="d-flex flex-row flex-wrap justify-content-between">{renderedPosts}</div>;
}
