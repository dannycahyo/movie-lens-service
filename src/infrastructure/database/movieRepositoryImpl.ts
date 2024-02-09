import { pool } from "../../config/dbConnection";

import type {
  Movie,
  MovieWithMostKeyword,
} from "../../domain/entities/movieEntity";
import type { PersonWithRevenue } from "../../domain/entities/personEntity";
import type { MovieRepository } from "../../domain/repositories/movieRepository";
import type { MovieRequestParams } from "../../interfaces/controllers/types/movieRequestParams";
import type { PaginationRequestParams } from "../../interfaces/controllers/types/paginationParams";

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
}
