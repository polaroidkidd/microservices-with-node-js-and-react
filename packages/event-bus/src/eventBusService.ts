import type { AxiosResponse } from "axios";
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

app.post(Routes.EVENTS, async (req: Request<{}, {}, IEventSchema>, res: Response<IPost | ZodError>) => {
  try {
    const parsedEvent = EventSchema.parse(req.body);

    const response: AxiosResponse<IPost> = await axios.post(ServiceEventEndpoints.POSTS, parsedEvent);
    // axios.post(SERVIVCES.COMMENTS, parsedEvent);
    // axios.post(SERVIVCES.QUERY, parsedEvent);

    res.status(200);
    res.send(response.data);
  } catch (e) {
    console.error(e);
    res.status(422).send(e as ZodError);
  }
});

app.listen(4005, () => {
  console.log('Service "Eventbus" is listening on 4005');
});
