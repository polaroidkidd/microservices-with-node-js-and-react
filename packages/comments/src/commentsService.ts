import bodyParser from "body-parser";
import cors from "cors";
import { randomBytes } from "crypto";
import type { Request, Response } from "express";
import express from "express";
import type { ZodError, z } from "zod";

import type { IPost } from "@ms/posts/src/post.zod";

import type { IComment, ICommentsByPostId } from "./comments.zod";
import {
  CommentSchema,
  CommentsByPostIdSchema,
  ICommentSchemaEvent,
} from "./comments.zod";

enum ROUTES {
  POSTS = "/posts/:id/comments",
  EVENTS = "/events",
}

const commentsByPostId: ICommentsByPostId = {};

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

const ResComment = CommentSchema.pick({ content: true });

type IResComment = z.infer<typeof ResComment>;

/**
 * Create Comment on Post
 */
app.post(
  ROUTES.POSTS,
  (
    req: Request<{ id: string }, {}, IResComment>,
    res: Response<IComment[] | ZodError>
  ) => {
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
  }
);

/**
 * Get Comments from Post
 */
app.get(
  ROUTES.POSTS,
  (req: Request<{ id: string }>, res: Response<IComment[]>) => {
    res.send(commentsByPostId[req.params.id] || []);
  }
);

/**
 * Handle Comment Event from Event-Bus
 */
app.post(
  ROUTES.EVENTS,
  (req: Request, res: Response<{ post: IPost } | ZodError>) => {
    const { body } = req;
    try {
      const parsedBody = ICommentSchemaEvent.parse(body);

      console.info("Event Received: ", parsedBody.type);
      res.status(200);
      res.send();
    } catch (e) {
      console.error(e);
      res.status(422).send(e as ZodError);
    }
  }
);
app.listen(4001, () => {
  console.info('Service "Comments" is listening on 4001');
});
