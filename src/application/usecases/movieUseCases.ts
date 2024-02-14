import type {
  NewMovie,
  Movie,
  MovieCastAndCrew,
  MovieWithMostKeyword,
} from "../../domain/entities/movieEntity";
import type { PersonWithRevenue } from "../../domain/entities/personEntity";
import type { MovieRepository } from "../../domain/repositories/movieRepository";
import type { MovieRequestParams } from "../../interfaces/controllers/types/movieRequestParams";
import type { PaginationRequestParams } from "../../interfaces/controllers/types/paginationParams";
import type { NewMovieDto } from "../../interfaces/dtos/movieDto";

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

  async getTopMoviesWithTheMostKeyword(
    params: PaginationRequestParams,
  ): Promise<MovieWithMostKeyword[]> {
    return await this.movieRepository.getTopMoviesWithTheMostKeyword(params);
  }

  async getMovieCastAndCrew(id: string): Promise<MovieCastAndCrew[]> {
    return await this.movieRepository.getMovieCastAndCrew(id);
  }

  async createMovie(movie: NewMovieDto): Promise<NewMovie> {
    return await this.movieRepository.createMovie(movie);
  }

  async deleteMovie(id: string): Promise<{ id: string }> {
    return await this.movieRepository.deleteMovie(id);
  }
}
