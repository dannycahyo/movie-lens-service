import { pool } from "../../config/dbConnection";

import type { Movie } from "../../domain/entities/movieEntity";
import type { MovieRepository } from "../../domain/repositories/movieRepository";
import type { MovieRequestParams } from "../../interfaces/controllers/types/movieRequestParams";

export class MovieRepositoryImpl implements MovieRepository {
  async getMovies(movieReqParams: MovieRequestParams): Promise<Movie[]> {
    const { page, limit, sort } = movieReqParams;
    const limitValue = limit ?? 20;
    const offset = page ? (page - 1) * limitValue : 0;
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
}
