import bodyParser from "body-parser";
import cors from "cors";
import { randomBytes } from "crypto";
import type { Request, Response } from "express";
import express from "express";
import type { ZodError } from "zod";

import type { IPost, IPosts } from "./post.zod";
import { IApiPostSchema, IPostSchema, IPostsSchema } from "./post.zod";

const posts: IPosts = {};

enum ROUTES {
  POSTS = "/posts",
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

app.post(ROUTES.POSTS, (req: Request<{}, {}, IPost>, res: Response<IPost | ZodError>) => {
  const id = randomBytes(4).toString("hex");

  const { body } = req;

  try {
    // parse request
    const parsedBody = IApiPostSchema.parse(body);
    const post = { id, title: parsedBody.title };

    // parse response
    IPostSchema.parse(post);

    posts[id] = post;

    res.status(201).send(post);
  } catch (e) {
    res.status(422).send(e as ZodError);
  }
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
