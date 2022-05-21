import z from "zod";

export const ICommentSchema = z.object({
  content: z.string(),
  id: z.string().optional(),
});

export const ICommentsByPostIdSchema = z.record(z.array(ICommentSchema));

export type IComment = z.infer<typeof ICommentSchema>;
export type ICommentsByPostId = z.infer<typeof ICommentsByPostIdSchema>;
