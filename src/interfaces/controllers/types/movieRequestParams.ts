import { z } from "zod";
import { PaginationRequestParamsSchema } from "./paginationParams";

const MovieRequestParamsSchema = PaginationRequestParamsSchema.extend({
  sort: z.string().optional(),
});

type MovieRequestParams = z.infer<typeof MovieRequestParamsSchema>;

export { MovieRequestParamsSchema, type MovieRequestParams };
