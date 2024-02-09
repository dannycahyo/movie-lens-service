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
  youtube_trailer_key: z.string(),
  abstract: z.string().nullable(),
  category: z.string().nullable(),
});

const MovieWithMostKeywordSchema = MovieSchema.extend({
  total_keyword: z.string(),
}).omit({ youtube_trailer_key: true, abstract: true });

type Movie = z.infer<typeof MovieSchema>;
type MovieWithMostKeyword = z.infer<typeof MovieWithMostKeywordSchema>;

export { MovieSchema, MovieWithMostKeywordSchema };
export type { Movie, MovieWithMostKeyword };
