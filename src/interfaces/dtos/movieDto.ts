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
  youtubeTrailerKey: z.string().nullable(),
  abstract: z.string().nullable(),
  category: z.string().nullable(),
});

const MovieWithMostKeywordDtoSchema = MovieDtoSchema.extend({
  totalKeyword: z.string(),
}).omit({ youtubeTrailerKey: true, abstract: true });

const MovieCastAndCrewDtoSchema = z.object({
  id: z.string(),
  personName: z.string(),
  role: z.string(),
  jobName: z.string(),
});

type MovieDto = z.infer<typeof MovieDtoSchema>;
type MovieWithMostKeywordDto = z.infer<typeof MovieWithMostKeywordDtoSchema>;
type MovieCastAndCrewDto = z.infer<typeof MovieCastAndCrewDtoSchema>;

export {
  MovieDtoSchema,
  MovieWithMostKeywordDtoSchema,
  MovieCastAndCrewDtoSchema,
};
export type { MovieDto, MovieWithMostKeywordDto, MovieCastAndCrewDto };
