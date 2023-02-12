import bodyParser from "body-parser";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import type { ZodError } from "zod";

import type { ICommentParsed } from "@ms/comments/src/comments.zod";
import {
  CommentSchemaEvent,
  CommentSchemaParsed,
} from "@ms/comments/src/comments.zod";
import { Events } from "@ms/event-bus/src/constants";
import type { IPost } from "@ms/posts/src/post.zod";

import type { IQuerySchema } from "./query.zod";

enum ROUTES {
  POSTS = "/posts",
  EVENTS = "/events",
}

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

const posts: IQuerySchema = {};

/**
 * Get All Posts
 */
app.get(ROUTES.POSTS, async (req: Request, res: Response<IQuerySchema>) => {
  res.send(posts);
});

/**
 * Handle Events
 */
app.post(
  ROUTES.EVENTS,
  async (req: Request<IPost | ICommentParsed>, res: Response) => {
    const { body } = req;
    try {
      if (body.type === Events.enum.PostCreated) {
        const { title, id } = body.data as IPost;
        posts[id] = { id, title, comments: [] };
      }

      if (body.type === Events.enum.CommentCreated) {
        const parsedComment = CommentSchemaParsed.parse(body.data);

        posts[parsedComment.postId].comments = [
          ...posts[parsedComment.postId].comments,
          parsedComment,
        ];
      }

      if (body.type === Events.enum.CommentModerated) {
        const { data: parsedComment } = CommentSchemaEvent.parse(body);

        posts[parsedComment.postId].comments = [
          ...posts[parsedComment.postId].comments.filter(
            ({ id }) => id !== parsedComment.id
          ),
          parsedComment,
        ];
      }

      res.status(200);
      res.send();
    } catch (e) {
      console.error("Failed at Query Service", e);
      res.status(422).send(e as ZodError);
    }
  }
);
app.listen(4002, () => {
  console.info('Service "Query" is listening on 4004');
});
