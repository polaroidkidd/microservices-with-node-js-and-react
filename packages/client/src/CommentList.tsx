import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

import type { IComment } from "@ms/comments/src/comments.zod";

export function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<IComment[]>([]);

  const fetchData = useCallback(async () => {
    const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);

    setComments(res.data);
  }, [postId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderedComments = comments.map(comment => <li key={comment.id}>{comment.content}</li>);

  return <ul>{renderedComments}</ul>;
}
