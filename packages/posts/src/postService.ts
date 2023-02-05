import type { AxiosResponse } from "axios";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import { randomBytes } from "crypto";
import type { Request, Response } from "express";
import express from "express";
import type { ZodError } from "zod";

import { ServiceEventEndpoints } from "@ms/event-bus/src/constants";

import type { IPost, IPosts } from "./post.zod";
import { IApiPostSchema, IPostSchema, IPostSchemaEvent, IPostsSchema } from "./post.zod";

const posts: IPosts = {};

enum ROUTES {
  POSTS = "/posts",
  EVENTS = "/events",
}

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.get(ROUTES.POSTS, (req: Request, res: Response<IPosts | ZodError>) => {
  try {
    IPostsSchema.parse(posts);
    res.status(200).send(posts);
  } catch (e) {
    res.status(500).send(e as ZodError);
  }
});

app.post(ROUTES.EVENTS, (req: Request, res: Response<{ post: IPost } | ZodError>) => {
  const { body } = req;
  try {
    const parsedBody = IPostSchemaEvent.parse(body);

    posts[parsedBody.data.id] = parsedBody.data;

    res.status(201);
    res.send({ post: parsedBody.data });
  } catch (e) {
    console.error(e);
    res.status(422).send(e as ZodError);
  }
});

app.post(ROUTES.POSTS, async (req: Request<{}, {}, IPost>, res: Response<IPost | ZodError>) => {
  const id = randomBytes(4).toString("hex");

  const { body } = req;

  try {
    // parse request
    const parsedBody = IApiPostSchema.parse(body);
    const post = { id, title: parsedBody.title };

    // parse response
    IPostSchema.parse(post);

    const response: AxiosResponse<IPost> = await axios.post(`${ServiceEventEndpoints.EVENT_BUS}`, {
      type: "PostCreated",
      data: post,
    });

    res.status(201).send(response.data);
  } catch (e) {
    res.status(422).send(e as ZodError);
  }
});

app.listen(4000, () => {
  console.log('Sercice "Posts" is listening on 4000');
});
