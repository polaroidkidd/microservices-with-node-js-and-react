import z from "zod";

export const CommentSchema = z.object({
  content: z.string(),
  id: z.string(),
});

export const ICommentSchemaEvent = z.object({
  type: z.string(),
  data: CommentSchema,
});
export const CommentsByPostIdSchema = z.record(z.array(CommentSchema));

export type IComment = z.infer<typeof CommentSchema>;
export type ICommentsByPostId = z.infer<typeof CommentsByPostIdSchema>;
