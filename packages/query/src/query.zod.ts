import { z } from "zod";

import { CommentSchemaParsed } from "@ms/comments/src/comments.zod";
import { IPostSchema } from "@ms/posts/src/post.zod";

export const QueryPostSchema = IPostSchema.extend({
  comments: z.array(CommentSchemaParsed),
});

export type IQueryPostSchema = z.infer<typeof QueryPostSchema>;

export const QuerySchema = z.record(z.string().min(1), QueryPostSchema);
export type IQuerySchema = z.infer<typeof QuerySchema>;
