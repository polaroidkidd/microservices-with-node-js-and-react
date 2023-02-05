import axios from "axios";
import React, { useEffect, useState } from "react";

import type { IQuerySchema } from "@ms/query/src/query.zod";

import { CommentCreate } from "./CommentCreate";
import { CommentList } from "./CommentList";

const fetchPosts = async () => axios.get("http://localhost:4002/posts");

export function PostList() {
  const [posts, setPosts] = useState<IQuerySchema>({});

  useEffect(() => {
    fetchPosts().then(response => setPosts(response.data));
  }, []);

  const renderedPosts = Object.values(posts).map(post => (
    <div
      className="card"
      style={{ width: "30%", marginBottom: "20px" }}
      key={post.id}
    >
      <div className="card-body">
        <h3>{post.title}</h3>
        <CommentList comments={post.comments} />
        <CommentCreate postId={post.id} />
      </div>
    </div>
  ));

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
}
