import z from "zod";

export const CommentSchemaBase = z.object({
  content: z.string(),
  id: z.string(),
  postId: z.string(),
});

export const CommentModerationState = z.enum([
  "Pending",
  "Rejected",
  "Approved",
]);

export const CommentSchemaParsed = CommentSchemaBase.extend({
  moderationState: CommentModerationState,
});

export const ICommentSchemaEvent = z.object({
  type: z.string(),
  data: CommentSchemaParsed,
});

// export const CommentsByPostIdSchema = z.record(z.array(CommentSchemaParsed));

export type ICommentModerationState = z.infer<typeof CommentModerationState>;
export type ICommentBase = z.infer<typeof CommentSchemaBase>;
export type ICommentParsed = z.infer<typeof CommentSchemaParsed>;
// export type ICommentsByPostId = z.infer<typeof CommentsByPostIdSchema>;
