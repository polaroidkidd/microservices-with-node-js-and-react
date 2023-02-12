import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import { randomBytes } from "crypto";
import type { Request, Response } from "express";
import express from "express";
import type { ZodError } from "zod";

import { Events, ServiceEventEndpoints } from "@ms/event-bus/src/constants";
import type { IPost } from "@ms/posts/src/post.zod";

import type { ICommentBase } from "./comments.zod";
import {
  CommentModerationState,
  CommentSchemaEvent,
  CommentSchemaParsed,
} from "./comments.zod";

enum ROUTES {
  POSTS = "/posts/:id/comments",
  EVENTS = "/events",
}

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

/**
 * Create Comment on Post
 */
app.post(
  ROUTES.POSTS,
  async (
    req: Request<{ id: string }, {}, ICommentBase>,
    res: Response<null | ZodError>
  ) => {
    const commentId = randomBytes(4).toString("hex");
    try {
      // parse request, add comment moderation state "Pending" and commentId
      const comment = CommentSchemaParsed.parse({
        ...req.body,
        id: commentId,
        postId: req.params.id,
        moderationState: CommentModerationState.enum.Pending,
      });

      // send comment to eventbus
      const response = await axios.post(ServiceEventEndpoints.EVENT_BUS, {
        type: Events.enum.CommentCreated,
        data: comment,
      });
      res.status(response.status).send();
    } catch (e) {
      console.error(e);
      res.status(500).send(e as ZodError);
    }
  }
);

/**
 * Handle Comment Event from Event-Bus
 */
app.post(
  ROUTES.EVENTS,
  async (req: Request, res: Response<{ post: IPost } | ZodError>) => {
    const { body } = req;
    try {
      if (body.type === Events.enum.CommentCreated) {
        const parsedBody = CommentSchemaEvent.parse(body);

        console.info("Event Received: ", parsedBody.type);
      }
      if (body.type === Events.enum.CommentUpdated) {
        const parsedBody = CommentSchemaEvent.parse(body);
        const comment = CommentSchemaParsed.parse(parsedBody.data);
        const content =
          comment.moderationState === CommentModerationState.enum.Rejected
            ? "Rejected by Mod Team"
            : comment.content;
        await axios.post(ServiceEventEndpoints.EVENT_BUS, {
          type: Events.enum.CommentUpdated,
          data: { ...comment, content },
        });
      }
      res.status(200).send();
    } catch (e) {
      console.error(e);
      res.status(422).send(e as ZodError);
    }
  }
);
app.listen(4001, () => {
  console.info('Service "Comments" is listening on 4001');
});
