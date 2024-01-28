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
        `
            SELECT
              id,
              name,
              date,
              kind,
              runtime,
              budget,
              revenue,
              vote_average,
              votes_count
            FROM movies
            ORDER BY ${order[0]} ${order[1]}
            OFFSET $1
            LIMIT $2
          `,
        [offset, limitValue],
      );

      return movies;
    } catch (error) {
      console.error(`Error on MovieRepositoryImpl.getMovies(): ${error}`);
      throw error;
    }
  }
}
