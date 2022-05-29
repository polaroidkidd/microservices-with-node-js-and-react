import bodyParser from "body-parser";
import cors from "cors";
import { randomBytes } from "crypto";
import type { Request, Response } from "express";
import express from "express";
import type { ZodError } from "zod";
import type z from "zod";

import type { IComment, ICommentsByPostId } from "./comments.zod";
import { CommentSchema, CommentsByPostIdSchema } from "./comments.zod";

enum ROUTES {
  POSTS = "/posts/:id/comments",
}

const commentsByPostId: ICommentsByPostId = {};

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.get(ROUTES.POSTS, (req: Request<{ id: string }>, res: Response<IComment[]>) => {
  res.send(commentsByPostId[req.params.id] || []);
});

const ResComment = CommentSchema.pick({ content: true });

type IResComment = z.infer<typeof ResComment>;

app.post(ROUTES.POSTS, (req: Request<{ id: string }, {}, IResComment>, res: Response<IComment[] | ZodError>) => {
  const commentId = randomBytes(4).toString("hex");
  try {
    // parse request
    const parsedBody = ResComment.parse(req.body);

    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id: commentId, content: parsedBody.content });
    commentsByPostId[req.params.id] = comments;

    // parse response
    CommentsByPostIdSchema.parse(commentsByPostId);

    res.status(201).send(comments);
  } catch (e) {
    console.error(e);
    res.status(422).send(e as ZodError);
  }
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
