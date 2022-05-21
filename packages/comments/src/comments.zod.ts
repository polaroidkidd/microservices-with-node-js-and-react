import z from "zod";

export const IApiCommentSchema = z.object({
  content: z.string(),
});

export const ICommentSchema = z.object({
  content: z.string(),
  id: z.string(),
});

export const IApiCommentsByPostIdSchema = z.record(z.array(ICommentSchema));

export type IComment = z.infer<typeof ICommentSchema>;
export type IApiComment = z.infer<typeof IApiCommentSchema>;
export type ICommentsByPostId = z.infer<typeof IApiCommentsByPostIdSchema>;
