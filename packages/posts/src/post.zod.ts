import z from "zod";

export const IPostSchema = z.object({
  title: z.string(),
  id: z.string(),
});

export const IPostSchemaEvent = z.object({
  type: z.string(),
  data: IPostSchema,
});

export const IApiPostSchema = z.object({
  title: z.string(),
});
export const IPostsSchema = z.record(IPostSchema);

export type IPost = z.infer<typeof IPostSchema>;
export type IPosts = z.infer<typeof IPostsSchema>;
