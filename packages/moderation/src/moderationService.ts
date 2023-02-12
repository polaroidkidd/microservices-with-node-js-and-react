import axios from "axios";
import bodyParser from "body-parser";
import type { Request, Response } from "express";
import express from "express";
import type { ZodError } from "zod";

import type { ICommentModerationState } from "@ms/comments/src/comments.zod";
import {
  CommentModerationState,
  CommentSchemaEvent,
} from "@ms/comments/src/comments.zod";
import { Events, ServiceEventEndpoints } from "@ms/event-bus/src/constants";
import type { IEventSchema } from "@ms/event-bus/src/events.zod";

const app = express();
app.use(bodyParser.json());

enum ROUTES {
  EVENTS = "/events",
}

/**
 * Handle CommentCreated event
 */
app.post(
  ROUTES.EVENTS,
  async (
    req: Request<{}, {}, IEventSchema>,
    res: Response<null | ZodError>
  ) => {
    const { body } = req;
    try {
      if (body.type === Events.enum.CommentCreated) {
        const { data: parsedComment } = CommentSchemaEvent.parse(req.body);
        if (
          parsedComment.moderationState === CommentModerationState.enum.Pending
        ) {
          const status: ICommentModerationState =
            parsedComment.content.includes("orange")
              ? CommentModerationState.enum.Rejected
              : CommentModerationState.enum.Approved;

          await axios.post<IEventSchema>(ServiceEventEndpoints.EVENT_BUS, {
            type: Events.enum.CommentModerated,
            data: { ...parsedComment, moderationState: status },
          });
        }
      }

      res.status(200).send();
    } catch (e) {
      console.error("Failed at Moderation Service", e);
      res.status(422).send(e as ZodError);
    }
  }
);

app.listen(4003, () => {
  console.info('Service "Moderation" is running on port 4003');
});
