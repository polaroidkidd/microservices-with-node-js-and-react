import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import type { ZodError } from "zod";

import type { IPost } from "@ms/posts/src/post.zod";

import { ServiceEventEndpoints } from "./constants";
import type { IEventSchema } from "./events.zod";
import { EventSchema } from "./events.zod";

enum Routes {
  EVENTS = "/events",
}

const app = express();
app.use(bodyParser.json());

app.use(cors({ origin: "http://localhost:3000" }));

const events: IEventSchema[] = [];
/**
 * Handle incoming events and spreading them to the other services
 */
app.post(
  Routes.EVENTS,
  async (
    req: Request<{}, {}, IEventSchema>,
    res: Response<IPost | ZodError>
  ) => {
    try {
      const parsedEvent = EventSchema.parse(req.body);
      events.push(parsedEvent);
      await axios.post(ServiceEventEndpoints.POSTS, parsedEvent);
      await axios.post(ServiceEventEndpoints.COMMENTS, parsedEvent);
      await axios.post(ServiceEventEndpoints.QUERY, parsedEvent);
      await axios.post(ServiceEventEndpoints.MODERATION, parsedEvent);

      res.status(200);
      res.send();
    } catch (e) {
      console.error("Failed at Event-Bus Service", e);
      res.status(422).send(e as ZodError);
    }
  }
);

/**
 * Get all events
 */
app.get(Routes.EVENTS, (req, res: Response<IEventSchema[]>) => {
  res.status(200).send(events);
});

app.listen(4005, () => {
  console.info('Service "Eventbus" is listening on 4005');
});
