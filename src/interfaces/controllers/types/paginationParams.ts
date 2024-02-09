import { z } from "zod";

const PaginationRequestParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

type PaginationRequestParams = z.infer<typeof PaginationRequestParamsSchema>;

export { PaginationRequestParamsSchema, type PaginationRequestParams };
