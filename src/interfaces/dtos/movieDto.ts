import { z } from "zod";

const MovieDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.date().nullable(),
  kind: z.string(),
  runtime: z.number().nullable(),
  budget: z.string().nullable(),
  revenue: z.string().nullable(),
  voteAverage: z.string().nullable(),
  votesCount: z.string().nullable(),
});

type MovieDto = z.infer<typeof MovieDtoSchema>;

export { MovieDtoSchema, type MovieDto };
