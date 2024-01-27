import { z } from "zod";

const MovieSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.date().nullable(),
  kind: z.string(),
  runtime: z.number().nullable(),
  budget: z.string().nullable(),
  revenue: z.string().nullable(),
  vote_average: z.number().nullable(),
  votes_count: z.number().nullable(),
});

type Movie = z.infer<typeof MovieSchema>;

export { MovieSchema, type Movie };
