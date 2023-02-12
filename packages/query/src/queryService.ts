import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import type { ZodError } from "zod";

import {
  CommentSchemaEvent,
  CommentSchemaParsed,
} from "@ms/comments/src/comments.zod";
import { Events, ServiceEventEndpoints } from "@ms/event-bus/src/constants";
import type { IEventSchema } from "@ms/event-bus/src/events.zod";
import { IPostSchema } from "@ms/posts/src/post.zod";

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

function handleEvent(body: IEventSchema) {
  if (body.type === Events.enum.PostCreated) {
    const post = IPostSchema.passthrough().parse(body.data);
    posts[post.id] = { id: post.id, title: post.title, comments: [] };
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
}

/**
 * Handle Events
 */
app.post(
  ROUTES.EVENTS,
  async (req: Request<{}, {}, IEventSchema>, res: Response) => {
    const { body } = req;

    try {
      handleEvent(body);

      res.status(200);
      res.send();
    } catch (e) {
      console.error("Failed at Query Service", e);
      res.status(422).send(e as ZodError);
    }
  }
);
app.listen(4002, async () => {
  console.info('Service "Query" is listening on 4004');
  const res = await axios.get(ServiceEventEndpoints.EVENT_BUS);

  const data = res.data as IEventSchema[];
  data.forEach(event => handleEvent(event));
});
