import type { Movie } from "../../domain/entities/movieEntity";
import type { PersonWithRevenue } from "../../domain/entities/personEntity";
import type { MovieRepository } from "../../domain/repositories/movieRepository";
import type { MovieRequestParams } from "../../interfaces/controllers/types/movieRequestParams";
import type { PaginationRequestParams } from "../../interfaces/controllers/types/paginationParams";

export class MovieUseCases {
  constructor(private movieRepository: MovieRepository) {}

  async getMovies(movieParams: MovieRequestParams): Promise<Movie[]> {
    return await this.movieRepository.getMovies(movieParams);
  }

  async getMovieById(id: string): Promise<Movie | null> {
    return await this.movieRepository.getMovieById(id);
  }

  async getTopPeopleWithMostRevenue(
    personParams: PaginationRequestParams,
  ): Promise<PersonWithRevenue[]> {
    return await this.movieRepository.getTopPeopleWithMostRevenue(personParams);
  }
}
