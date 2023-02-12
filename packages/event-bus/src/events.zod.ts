import z from "zod";

import {
  CommentSchemaBase,
  CommentSchemaParsed,
} from "@ms/comments/src/comments.zod";
import {
  IApiPostSchema,
  IPostSchema,
  IPostsSchema,
} from "@ms/posts/src/post.zod";

export const EventSchema = z
  .object({
    type: z.string().regex(/Created$|Moderated$|Updated$/),
    data: CommentSchemaBase.passthrough()
      .or(CommentSchemaParsed)
      .or(IPostSchema)
      .or(IApiPostSchema)
      .or(IPostsSchema),
  })
  .strict();

export type IEventSchema = z.infer<typeof EventSchema>;
