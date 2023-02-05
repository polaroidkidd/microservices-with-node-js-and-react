import z from "zod";

export const EventSchema = z.object({
  type: z.string().regex(/Created$/),
  data: z.any(),
});

export type IEventSchema = z.infer<typeof EventSchema>;
