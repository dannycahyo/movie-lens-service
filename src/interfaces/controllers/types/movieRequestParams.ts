import { z } from "zod";

const MovieRequestParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sort: z.string().optional(),
});

type MovieRequestParams = z.infer<typeof MovieRequestParamsSchema>;

export { MovieRequestParamsSchema, type MovieRequestParams };
