import React from "react";

import type { ICommentParsed } from "@ms/comments/src/comments.zod";
import { CommentModerationState } from "@ms/comments/src/comments.zod";

export function CommentList({ comments }: { comments: ICommentParsed[] }) {
  const parsedComments: ICommentParsed[] = comments.map(comment => {
    switch (comment.moderationState) {
      case CommentModerationState.enum.Approved: {
        return comment;
      }
      case CommentModerationState.enum.Rejected: {
        return { ...comment, content: "Comment has been rejected" };
      }
      default: {
        return { ...comment, content: "Moderation is pedning" };
      }
    }
  });

  return (
    <>
      {parsedComments.map(comment => (
        <li key={comment.id}>{comment.content}</li>
      ))}
    </>
  );
}
