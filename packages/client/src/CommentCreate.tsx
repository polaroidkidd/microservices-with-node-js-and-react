import axios from "axios";
import type { FormEvent } from "react";
import React, { useState } from "react";

export function CommentCreate({ postId }: { postId: string }) {
  const [content, setContent] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
      content,
    });

    setContent("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="comment">
            New Comment
            <input id="comment" value={content} onChange={e => setContent(e.target.value)} className="form-control" />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
