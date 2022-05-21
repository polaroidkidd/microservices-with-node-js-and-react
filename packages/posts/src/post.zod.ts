import z from "zod";

export const IPostSchema = z.object({
  title: z.string(),
  id: z.string(),
});

export const IApiPostSchema = z.object({
  title: z.string(),
});
export const IPostsSchema = z.record(IPostSchema);

export type IPost = z.infer<typeof IPostSchema>;
export type IPosts = z.infer<typeof IPostsSchema>;
