import bodyParser from "body-parser";
import { randomBytes } from "crypto";
import type { Request, Response } from "express";
import express from "express";
import type { ZodError } from "zod";

import type { IComment, ICommentsByPostId } from "./comments.zod";
import { ICommentSchema } from "./comments.zod";

enum ROUTES {
  POSTS = "/posts/:id/comments",
}

const commentsByPostId: ICommentsByPostId = {};

const app = express();
app.use(bodyParser.json());

app.get(ROUTES.POSTS, (req: Request<{ id: string }>, res: Response<IComment[]>) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post(ROUTES.POSTS, (req: Request<{ id: string }, {}, IComment>, res: Response<IComment[] | ZodError>) => {
  const commentId = randomBytes(4).toString("hex");
  try {
    const parsedBody = ICommentSchema.parse(req.body);
    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content: parsedBody.content });

    commentsByPostId[req.params.id] = comments;
    res.status(201).send(comments);
  } catch (e) {
    console.error(e);
    res.status(422).send(e as ZodError);
  }
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
