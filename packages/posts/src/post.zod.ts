import z from "zod";

export const IPostSchema = z.object({
  title: z.string(),
  id: z.string().optional(),
});
export const IPostsSchema = z.record(IPostSchema);

export type IPost = z.infer<typeof IPostSchema>;
export type IPosts = z.infer<typeof IPostsSchema>;
