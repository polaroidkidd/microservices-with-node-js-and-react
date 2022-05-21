import bodyParser from "body-parser";
import { randomBytes } from "crypto";
import type { Request, Response } from "express";
import express from "express";
import type { ZodError } from "zod";

import type { IPost, IPosts } from "./post.zod";
import { IPostSchema } from "./post.zod";

const posts: IPosts = {};

enum ROUTES {
  POSTS = "/posts",
}

const app = express();
app.use(bodyParser.json());
app.get(ROUTES.POSTS, (req: Request, res: Response<IPosts>) => {
  res.send(posts);
});

app.post(ROUTES.POSTS, (req: Request<{}, {}, IPost>, res: Response<IPost | ZodError>) => {
  const id = randomBytes(4).toString("hex");

  const { body } = req;

  try {
    const parsedBody = IPostSchema.parse(body);
    posts[id] = { id, title: parsedBody.title };

    res.status(201).send(posts[id]);
  } catch (e) {
    res.status(422).send(e as ZodError);
  }
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
