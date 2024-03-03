import { pool } from "../../config/dbConnection";

import type {
  Movie,
  MovieWithMostKeyword,
  MovieCastAndCrew,
  MainMovieTable,
  Country,
  Category,
  Keyword,
  Cast,
  Language,
  Trailer,
  Link,
  NewMovie,
  EnAbstractSchema,
} from "../../domain/entities/movieEntity";
import type { PersonWithRevenue } from "../../domain/entities/personEntity";
import type { MovieRepository } from "../../domain/repositories/movieRepository";
import type { MovieRequestParams } from "../../interfaces/controllers/types/movieRequestParams";
import type { PaginationRequestParams } from "../../interfaces/controllers/types/paginationParams";
import type { NewMovieDto } from "../../interfaces/dtos/movieDto";

export class MovieRepositoryImpl implements MovieRepository {
  async getMovies(movieReqParams: MovieRequestParams): Promise<Movie[]> {
    const { page, limit, sort } = movieReqParams;
    const limitValue = limit ?? 20;
    const offset = page ? (Number(page) - 1) * Number(limitValue) : 0;
    const order = sort ? sort.split(":") : ["id", "asc"];

    try {
      const { rows: movies } = await pool.query<Movie>(
        `SELECT 
          m.id, m.name, m.date, m.kind, m.runtime, m.budget, m.revenue, m.vote_average, m.votes_count, t.key as youtube_trailer_key, man.abstract, c.name as category
        FROM 
          movies m
        LEFT JOIN 
          trailers t 
        ON 
          m.id = t.movie_id
        LEFT JOIN
          movie_abstracts_en man
        ON
          m.id = man.movie_id
        LEFT JOIN
          categories c
        ON
          m.parent_id = c.parent_id
        WHERE
          t.source = 'youtube'
        ORDER BY 
          ${order[0]} ${order[1]}
        LIMIT $1 OFFSET $2`,
        [limitValue, offset],
      );

      return movies;
    } catch (error) {
      console.error(`Error on MovieRepositoryImpl.getMovies(): ${error}`);
      throw error;
    }
  }

  async getMovieById(id: string): Promise<Movie | null> {
    try {
      const { rows: movies } = await pool.query<Movie>(
        `SELECT 
          m.id, m.name, m.date, m.kind, m.runtime, m.budget, m.revenue, m.vote_average, m.votes_count, t.key as youtube_trailer_key, man.abstract, c.name as category
        FROM
          movies m
        LEFT JOIN
          trailers t
        ON
          m.id = t.movie_id
        LEFT JOIN
          movie_abstracts_en man
        ON
          m.id = man.movie_id
        LEFT JOIN
          categories c
        ON
          m.parent_id = c.parent_id
        WHERE
          m.id = $1
        AND
          t.source = 'youtube'
        `,
        [id],
      );

      return movies[0] ?? null;
    } catch (error) {
      console.error(`Error on MovieRepositoryImpl.getMovieById(): ${error}`);
      throw error;
    }
  }

  async getTopPeopleWithMostRevenue(
    personParams: PaginationRequestParams,
  ): Promise<PersonWithRevenue[]> {
    const { page, limit } = personParams;
    const limitValue = limit ?? 20;
    const offset = page ? (Number(page) - 1) * Number(limitValue) : 0;

    try {
      const { rows: people } = await pool.query<PersonWithRevenue>(
        `
        SELECT 
          p.id, p.name, p.birthday, p.deathday, p.gender, sum(m.revenue) as total_revenue
        FROM
          movies m
        INNER JOIN
          casts c 
        ON
          m.id = c.movie_id 
        INNER JOIN 
          people p
        ON
          c.person_id = p.id 
        GROUP BY
          p.id, p.name
        ORDER BY
          total_revenue DESC NULLS LAST
        LIMIT $1 OFFSET $2;
        `,
        [limitValue, offset],
      );

      return people;
    } catch (error) {
      console.error(
        `Error on MovieRepositoryImpl.getTopPeopleWithMostRevenue(): ${error}`,
      );
      throw error;
    }
  }

  async getTopMoviesWithTheMostKeyword(
    paginationParams: PaginationRequestParams,
  ): Promise<MovieWithMostKeyword[]> {
    const { page, limit } = paginationParams;
    const limitValue = limit ?? 20;
    const offset = page ? (Number(page) - 1) * Number(limitValue) : 0;

    try {
      const { rows: movies } = await pool.query<MovieWithMostKeyword>(
        `
        SELECT 
          m.id, m.name, m.date, m.kind, m.runtime, m.budget, m.revenue, m.vote_average, m.votes_count, c.name as category, COUNT(c.id) as total_keyword
        FROM
          movies m
        INNER JOIN
          movie_keywords mk
        ON
          m.id = mk.movie_id
        INNER JOIN
          categories c
        ON
          mk.category_id = c.id
        GROUP BY
          m.id, m.name, c.name 
        ORDER BY
          total_keyword DESC
        LIMIT $1 OFFSET $2;
        `,
        [limitValue, offset],
      );

      return movies;
    } catch (error) {
      console.error(
        `Error on MovieRepositoryImpl.getTopMoviesWithTheMostKeyword(): ${error}`,
      );
      throw error;
    }
  }

  async getMovieCastAndCrew(id: string): Promise<MovieCastAndCrew[]> {
    try {
      const { rows: castAndCrew } = await pool.query<MovieCastAndCrew>(
        `
        SELECT 
          p.id, p.name, c.role, j.name as job
        FROM
          people p
        INNER JOIN
          casts c
        ON
          p.id = c.person_id
        INNER JOIN
          jobs j
        ON
          c.job_id = j.id
        WHERE
          c.movie_id = $1;
        `,
        [id],
      );

      return castAndCrew;
    } catch (error) {
      console.error(
        `Error on MovieRepositoryImpl.getMovieCastAndCrew(): ${error}`,
      );
      throw error;
    }
  }

  async createMovie(movie: NewMovieDto): Promise<NewMovie> {
    try {
      const {
        id: movieId,
        countries,
        enAbstract,
        categories,
        keywords,
        budget,
        casts,
        date,
        homepage,
        kind,
        languages,
        links,
        name,
        parentId,
        revenue,
        runtime,
        seriesId,
        trailers,
        voteAverage,
        votesCount,
      } = movie;
      await pool.query("BEGIN");
      const insertMovieQuery = `
        INSERT INTO
          movies (id, name, parent_id, date, series_id, kind, runtime, budget, revenue, homepage, vote_average, votes_count)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
      `;
      const { rows: createdMovie } = await pool.query<MainMovieTable>(
        insertMovieQuery,
        [
          movieId,
          name,
          parentId,
          date,
          seriesId,
          kind,
          runtime,
          budget,
          revenue,
          homepage,
          voteAverage,
          votesCount,
        ],
      );

      createdMovie[0].id = Number(createdMovie[0].id);
      createdMovie[0].parent_id = Number(createdMovie[0].parent_id);

      const insertMovieAbstractQuery = `
        INSERT INTO
          movie_abstracts_en (movie_id, abstract)
        VALUES
          ($1, $2)
        RETURNING abstract;
      `;

      const { rows: createdMovieAbstractEN } =
        await pool.query<EnAbstractSchema>(insertMovieAbstractQuery, [
          movieId,
          enAbstract.abstract,
        ]);

      const insertMovieCountryQuery = `
        INSERT INTO
          movie_countries (movie_id, country)
        VALUES
          ($1, $2)
        RETURNING country;
      `;

      const createdCountries: Country[] = [];

      for (const country of countries) {
        const { rows: createdCountry } = await pool.query<Country>(
          insertMovieCountryQuery,
          [movieId, country.country],
        );
        createdCountries.push(createdCountry[0]);
      }

      const insertMovieCategoryQuery = `
        INSERT INTO
          movie_categories (movie_id, category_id)
        VALUES
          ($1, $2)
        RETURNING category_id;
      `;

      const createdCategories: Category[] = [];

      for (const category of categories) {
        const { rows: createdCategory } = await pool.query(
          insertMovieCategoryQuery,
          [movieId, category.categoryId],
        );
        createdCategory[0].category_id = Number(createdCategory[0].category_id);
        createdCategories.push(createdCategory[0]);
      }

      const insertMovieKeywordQuery = `
        INSERT INTO
          movie_keywords (movie_id, category_id)
        VALUES
          ($1, $2)
        RETURNING category_id;
      `;

      const createdKeywords: Keyword[] = [];

      for (const keyword of keywords) {
        const { rows: createdKeyword } = await pool.query(
          insertMovieKeywordQuery,
          [movieId, keyword.categoryId],
        );
        createdKeyword[0].category_id = Number(createdKeyword[0].category_id);
        createdKeywords.push(createdKeyword[0]);
      }

      const insertMovieCastQuery = `
        INSERT INTO
          casts (movie_id, person_id, job_id, role, position)
        VALUES
          ($1, $2, $3, $4, $5)
        RETURNING person_id, job_id, role, position;
      `;

      const createdCasts: Cast[] = [];

      for (const cast of casts) {
        const { rows: createdCast } = await pool.query<Cast>(
          insertMovieCastQuery,
          [movieId, cast.personId, cast.jobId, cast.role, cast.position],
        );
        createdCast[0].person_id = Number(createdCast[0].person_id);
        createdCast[0].job_id = Number(createdCast[0].job_id);
        createdCasts.push(createdCast[0]);
      }

      const insertMovieLanguageQuery = `
        INSERT INTO
          movie_languages (movie_id, language)
        VALUES
          ($1, $2)
        RETURNING language;
      `;

      const createdLanguages: Language[] = [];

      for (const language of languages) {
        const { rows: createdLanguage } = await pool.query<Language>(
          insertMovieLanguageQuery,
          [movieId, language.language],
        );
        createdLanguages.push(createdLanguage[0]);
      }

      const insertMovieTrailerQuery = `
        INSERT INTO
          trailers (trailer_id,movie_id, key, language, source)
        VALUES
          ($1, $2, $3, $4, $5)
        RETURNING trailer_id, key, language, source;
      `;

      const createdTrailers: Trailer[] = [];

      for (const trailer of trailers) {
        const { rows: createdTrailer } = await pool.query<Trailer>(
          insertMovieTrailerQuery,
          [
            trailer.trailerId,
            movieId,
            trailer.key,
            trailer.language,
            trailer.source,
          ],
        );
        createdTrailer[0].trailer_id = Number(createdTrailer[0].trailer_id);
        createdTrailers.push(createdTrailer[0]);
      }

      const insertMovieLinkQuery = `
        INSERT INTO
          movie_links (movie_id, key, language, source)
        VALUES
          ($1, $2, $3, $4)
        RETURNING key, language, source;
      `;

      const createdLinks: Link[] = [];

      for (const link of links) {
        const { rows: created } = await pool.query<Link>(insertMovieLinkQuery, [
          movieId,
          link.key,
          link.language,
          link.source,
        ]);
        createdLinks.push(created[0]);
      }

      await pool.query("COMMIT");

      return {
        ...createdMovie[0],
        en_abstract: createdMovieAbstractEN[0],
        countries: createdCountries,
        categories: createdCategories,
        keywords: createdKeywords,
        casts: createdCasts,
        languages: createdLanguages,
        trailers: createdTrailers,
        links: createdLinks,
      };
    } catch (error) {
      await pool.query("ROLLBACK");
      console.error(`Error on MovieRepositoryImpl.createMovie(): ${error}`);
      throw error;
    }
  }

  async updateMovie(id: string, movie: NewMovieDto): Promise<NewMovie> {
    try {
      const {
        id: movieId,
        countries,
        enAbstract,
        categories,
        keywords,
        budget,
        casts,
        date,
        homepage,
        kind,
        languages,
        links,
        name,
        parentId,
        revenue,
        runtime,
        seriesId,
        trailers,
        voteAverage,
        votesCount,
      } = movie;

      await pool.query("BEGIN");

      const updateMovieQuery = `
        UPDATE
          movies
        SET
          name = $1,
          parent_id = $2,
          date = $3,
          series_id = $4,
          kind = $5,
          runtime = $6,
          budget = $7,
          revenue = $8,
          homepage = $9,
          vote_average = $10,
          votes_count = $11
        WHERE
          id = $12
        RETURNING *;
      `;

      const { rows: updatedMovie } = await pool.query<MainMovieTable>(
        updateMovieQuery,
        [
          name,
          parentId,
          date,
          seriesId,
          kind,
          runtime,
          budget,
          revenue,
          homepage,
          voteAverage,
          votesCount,
          movieId,
        ],
      );

      const updateMovieAbstractQuery = `
        UPDATE
          movie_abstracts_en
        SET
          abstract = $1
        WHERE
          movie_id = $2
        RETURNING abstract;
      `;

      const { rows: updatedMovieAbstractEN } =
        await pool.query<EnAbstractSchema>(updateMovieAbstractQuery, [
          enAbstract.abstract,
          movieId,
        ]);

      const updatedMovieCountryQuery = `
        UPDATE
          movie_countries
        SET
          country = $1
        WHERE
          movie_id = $2
        RETURNING country;
      `;

      const updatedCountries: Country[] = [];

      for (const country of countries) {
        const { rows: updatedCountry } = await pool.query<Country>(
          updatedMovieCountryQuery,
          [country.country, movieId],
        );
        updatedCountries.push(updatedCountry[0]);
      }

      const updatedMovieCategoryQuery = `
        UPDATE
          movie_categories
        SET
          category_id = $1
        WHERE
          movie_id = $2
        RETURNING category_id;
      `;

      const updatedCategories: Category[] = [];

      for (const category of categories) {
        const { rows: updatedCategory } = await pool.query(
          updatedMovieCategoryQuery,
          [category.categoryId, movieId],
        );
        updatedCategories.push(updatedCategory[0]);
      }

      const updatedMovieKeywordQuery = `
        UPDATE
          movie_keywords
        SET
          category_id = $1
        WHERE
          movie_id = $2
        RETURNING category_id;
      `;

      const updatedKeywords: Keyword[] = [];

      for (const keyword of keywords) {
        const { rows: updatedKeyword } = await pool.query(
          updatedMovieKeywordQuery,
          [keyword.categoryId, movieId],
        );
        updatedKeywords.push(updatedKeyword[0]);
      }

      const updatedMovieCastQuery = `
        UPDATE
          casts
        SET
          person_id = $1,
          job_id = $2,
          role = $3,
          position = $4
        WHERE
          movie_id = $5
        RETURNING person_id, job_id, role, position;
      `;

      const updatedCasts: Cast[] = [];

      for (const cast of casts) {
        const { rows: updatedCast } = await pool.query<Cast>(
          updatedMovieCastQuery,
          [cast.personId, cast.jobId, cast.role, cast.position, movieId],
        );
        updatedCasts.push(updatedCast[0]);
      }

      const updatedMovieLanguageQuery = `
        UPDATE
          movie_languages
        SET
          language = $1
        WHERE
          movie_id = $2
        RETURNING language;
      `;

      const updatedLanguages: Language[] = [];

      for (const language of languages) {
        const { rows: updatedLanguage } = await pool.query<Language>(
          updatedMovieLanguageQuery,
          [language.language, movieId],
        );
        updatedLanguages.push(updatedLanguage[0]);
      }

      const updatedMovieTrailerQuery = `
        UPDATE
          trailers
        SET
          key = $1,
          language = $2,
          source = $3
        WHERE
          movie_id = $4
        RETURNING trailer_id, key, language, source;
      `;

      const updatedTrailers: Trailer[] = [];

      for (const trailer of trailers) {
        const { rows: updatedTrailer } = await pool.query<Trailer>(
          updatedMovieTrailerQuery,
          [trailer.key, trailer.language, trailer.source, movieId],
        );
        updatedTrailers.push(updatedTrailer[0]);
      }

      const updatedMovieLinkQuery = `
        UPDATE
          movie_links
        SET
          key = $1,
          language = $2,
          source = $3
        WHERE
          movie_id = $4
        RETURNING key, language, source;
      `;

      const updatedLinks: Link[] = [];

      for (const link of links) {
        const { rows: updated } = await pool.query<Link>(
          updatedMovieLinkQuery,
          [link.key, link.language, link.source, movieId],
        );
        updatedLinks.push(updated[0]);
      }

      await pool.query("COMMIT");

      return {
        ...updatedMovie[0],
        en_abstract: updatedMovieAbstractEN[0],
        countries: updatedCountries,
        categories: updatedCategories,
        keywords: updatedKeywords,
        casts: updatedCasts,
        languages: updatedLanguages,
        trailers: updatedTrailers,
        links: updatedLinks,
      };
    } catch (error) {
      console.error(`Error on MovieRepositoryImpl.updateMovie(): ${error}`);
      throw error;
    }
  }

  async deleteMovie(id: string): Promise<{ id: string }> {
    try {
      const { rows: deletedMovie } = await pool.query<{ id: string }>(
        `DELETE FROM 
          movies
        WHERE
          id = $1
          RETURNING id;`,
        [id],
      );

      return deletedMovie[0] ?? null;
    } catch (error) {
      console.error(`Error on MovieRepositoryImpl.deleteMovie(): ${error}`);
      throw error;
    }
  }
}
