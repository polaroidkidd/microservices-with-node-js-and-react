import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import type { ZodError } from "zod";

import type { IEventSchema } from "./events.zod";
import { EventSchema } from "./events.zod";

enum Routes {
  EVENTS = "/events",
}

export enum SERVIVCES {
  COMMENTS = "http://localhost:4000/events",
  POSTS = "http://localhost:4001/events",
  QUERY = "http://localhost:4002/events",
}

const app = express();
app.use(bodyParser.json());

app.use(cors({ origin: "http://localhost:3000" }));

app.post(Routes.EVENTS, (req: Request<{}, {}, IEventSchema>, res: Response<{ status: string } | ZodError>) => {
  try {
    const parsedEvent = EventSchema.parse(req.body);
    axios.post(SERVIVCES.POSTS, parsedEvent);
    axios.post(SERVIVCES.COMMENTS, parsedEvent);
    axios.post(SERVIVCES.QUERY, parsedEvent);

    res.status(200).send({ status: "ok" });
  } catch (e) {
    console.error(e);
    res.status(422).send(e as ZodError);
  }
});

app.listen(4005, () => {
  console.log('Service "Eventbus" is listening on 4005');
});
