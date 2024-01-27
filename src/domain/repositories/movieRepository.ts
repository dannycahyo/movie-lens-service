import type { Movie } from "../entities/movieEntity";
import type { MovieRequestParams } from "../../interfaces/controllers/types/movieRequestParams";

export interface MovieRepository {
  getMovies(moviePrams: MovieRequestParams): Promise<Movie[]>;
}
