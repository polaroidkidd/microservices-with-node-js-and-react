import axios from "axios";
import type { FormEvent } from "react";
import React, { useState } from "react";

export function PostCreate() {
  const [title, setTitle] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await axios.post("http://localhost:4000/posts", {
      title,
    });

    setTitle("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="post">
            Title
            <input id="post" value={title} onChange={e => setTitle(e.target.value)} className="form-control" />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
