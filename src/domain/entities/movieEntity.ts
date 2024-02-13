import { z } from "zod";

const MainMovieTableSchema = z.object({
  id: z.string().or(z.number()),
  name: z.string(),
  parent_id: z.number(),
  date: z.date().nullable(),
  series_id: z.number().nullable(),
  kind: z.string(),
  runtime: z.string().nullable(),
  budget: z.string().nullable(),
  revenue: z.string().nullable(),
  homepage: z.string().nullable(),
  vote_average: z.string().nullable(),
  votes_count: z.string().nullable(),
});

const MovieSchema = z.object({
  ...MainMovieTableSchema.omit({
    parent_id: true,
    series_id: true,
    homepage: true,
  }).shape,
  youtube_trailer_key: z.string(),
  abstract: z.string().nullable(),
  category: z.string().nullable(),
});

const MovieWithMostKeywordSchema = MovieSchema.extend({
  total_keyword: z.string(),
}).omit({ youtube_trailer_key: true, abstract: true });

const MovieCastAndCrewSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  job: z.string(),
});

const KeywordSchema = z.object({
  category_id: z.number(),
});

const LanguageSchema = z.object({
  language: z.string(),
});

const CategorySchema = z.object({
  category_id: z.number(),
});

const CastSchema = z.object({
  person_id: z.number(),
  job_id: z.number(),
  role: z.string(),
  position: z.number(),
});

const TrailerSchema = z.object({
  trailer_id: z.number(),
  key: z.string(),
  language: z.string(),
  source: z.string(),
});

const EnAbstractSchema = z.object({
  abstract: z.string(),
});

const MovieAbstractENSchema = z.object({
  movie_id: z.string(),
  abstract: z.string(),
});

const LinkSchema = z.object({
  key: z.string(),
  language: z.string(),
  source: z.string(),
});

const CountrySchema = z.object({
  country: z.string(),
});

const CreateMovieSchema = z.object({
  ...MainMovieTableSchema.shape,
  keywords: z.array(KeywordSchema),
  languages: z.array(LanguageSchema),
  categories: z.array(CategorySchema),
  casts: z.array(CastSchema),
  trailers: z.array(TrailerSchema),
  en_abstract: EnAbstractSchema,
  links: z.array(LinkSchema),
  countries: z.array(CountrySchema),
});

type MainMovieTable = z.infer<typeof MainMovieTableSchema>;
type Movie = z.infer<typeof MovieSchema>;
type MovieWithMostKeyword = z.infer<typeof MovieWithMostKeywordSchema>;
type MovieCastAndCrew = z.infer<typeof MovieCastAndCrewSchema>;
type MovieAbstractEN = z.infer<typeof MovieAbstractENSchema>;
type CreateMovie = z.infer<typeof CreateMovieSchema>;
type Keyword = z.infer<typeof KeywordSchema>;
type Language = z.infer<typeof LanguageSchema>;
type Category = z.infer<typeof CategorySchema>;
type Cast = z.infer<typeof CastSchema>;
type Trailer = z.infer<typeof TrailerSchema>;
type EnAbstractSchema = z.infer<typeof EnAbstractSchema>;
type Link = z.infer<typeof LinkSchema>;
type Country = z.infer<typeof CountrySchema>;

export {
  MovieSchema,
  MovieWithMostKeywordSchema,
  MovieCastAndCrewSchema,
  CreateMovieSchema,
};
export type {
  MainMovieTable,
  Movie,
  MovieWithMostKeyword,
  MovieCastAndCrew,
  MovieAbstractEN,
  CreateMovie,
  Keyword,
  Language,
  Category,
  Cast,
  Trailer,
  Link,
  Country,
  EnAbstractSchema,
};
