import { z } from "zod";

export enum ServiceEventEndpoints {
  POSTS = "http://localhost:4000/events",
  COMMENTS = "http://localhost:4001/events",
  QUERY = "http://localhost:4002/events",
  MODERATION = "http://localhost:4003/events",
  EVENT_BUS = "http://localhost:4005/events",
}

export const Events = z.enum([
  "PostCreated",
  "CommentCreated",
  "CommentModerated",
  "CommentUpdated",
]);

export type IEvents = z.infer<typeof Events>;
