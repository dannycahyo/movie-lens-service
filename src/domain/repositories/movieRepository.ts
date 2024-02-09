import type { Movie, MovieWithMostKeyword } from "../entities/movieEntity";
import type { MovieRequestParams } from "../../interfaces/controllers/types/movieRequestParams";
import type { PersonWithRevenue } from "../entities/personEntity";
import type { PaginationRequestParams } from "../../interfaces/controllers/types/paginationParams";

export interface MovieRepository {
  getMovies(moviePrams: MovieRequestParams): Promise<Movie[]>;
  getMovieById(id: string): Promise<Movie | null>;
  getTopPeopleWithMostRevenue(
    personParams: PaginationRequestParams,
  ): Promise<PersonWithRevenue[]>;
  getTopMoviesWithTheMostKeyword(
    paginationParams: PaginationRequestParams,
  ): Promise<MovieWithMostKeyword[]>;
}
