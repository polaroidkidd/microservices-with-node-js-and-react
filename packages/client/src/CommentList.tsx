import React from "react";

import type { IComment } from "@ms/comments/src/comments.zod";

export function CommentList({ comments }: { comments: IComment[] }) {
  return (
    <>
      {comments.map(comment => (
        <li key={comment.id}>{comment.content}</li>
      ))}
    </>
  );
}
