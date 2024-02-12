import { z } from "zod";

const MainMovieTableDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  parentId: z.number(),
  date: z.coerce.date().nullable(),
  seriesId: z.number().nullable(),
  kind: z.string(),
  runtime: z.number().nullable(),
  budget: z.string().nullable(),
  revenue: z.string().nullable(),
  homepage: z.string().nullable(),
  voteAverage: z.string().nullable(),
  votesCount: z.string().nullable(),
});

const MovieDtoSchema = z.object({
  ...MainMovieTableDtoSchema.omit({
    parentId: true,
    seriesId: true,
    homePage: true,
  }).shape,
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

const KeywordDtoSchema = z.object({
  categoryId: z.number(),
});

const LanguageDtoSchema = z.object({
  language: z.string(),
});

const CategoryDtoSchema = z.object({
  categoryId: z.number(),
});

const CastDtoSchema = z.object({
  personId: z.number(),
  jobId: z.number(),
  role: z.string(),
  position: z.number(),
});

const TrailerDtoSchema = z.object({
  trailerId: z.number(),
  key: z.string(),
  language: z.string(),
  source: z.string(),
});

const EnAbstractSchema = z.object({
  abstract: z.string(),
});

const LinkDtoSchema = z.object({
  key: z.string(),
  language: z.string(),
  source: z.string(),
});

const CountryDtoSchema = z.object({
  country: z.string(),
});

const CreateMovieDtoSchema = z.object({
  ...MainMovieTableDtoSchema.shape,
  keywords: z.array(KeywordDtoSchema),
  languages: z.array(LanguageDtoSchema),
  categories: z.array(CategoryDtoSchema),
  casts: z.array(CastDtoSchema),
  trailers: z.array(TrailerDtoSchema),
  enAbstract: EnAbstractSchema,
  links: z.array(LinkDtoSchema),
  countries: z.array(CountryDtoSchema),
});

type MovieDto = z.infer<typeof MovieDtoSchema>;
type MovieWithMostKeywordDto = z.infer<typeof MovieWithMostKeywordDtoSchema>;
type MovieCastAndCrewDto = z.infer<typeof MovieCastAndCrewDtoSchema>;
type CreateMovieDto = z.infer<typeof CreateMovieDtoSchema>;

export {
  MovieDtoSchema,
  MovieWithMostKeywordDtoSchema,
  MovieCastAndCrewDtoSchema,
  CreateMovieDtoSchema,
};
export type {
  MovieDto,
  MovieWithMostKeywordDto,
  MovieCastAndCrewDto,
  CreateMovieDto,
};
