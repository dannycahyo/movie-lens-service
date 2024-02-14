import { MovieUseCases } from "../../application/usecases/movieUseCases";
import {
  MovieDtoSchema,
  MovieWithMostKeywordDtoSchema,
  MovieCastAndCrewDtoSchema,
  NewMovieDtoSchema,
} from "../dtos/movieDto";
import { PersonWithRevenueDTOSchema } from "../dtos/personDto";
import { MovieRequestParamsSchema } from "./types/movieRequestParams";
import { PaginationRequestParamsSchema } from "./types/paginationParams";
import { MovieRepositoryImpl } from "../../infrastructure/database/movieRepositoryImpl";
import {
  convertNestedObjectsToCamelCase,
  convertObjectToCamelCase,
} from "../../utils/convertObjectToCamelCase";
import { sendSuccess, sendError } from "../../utils/sendResponses";

import type {
  MovieDto,
  MovieWithMostKeywordDto,
  MovieCastAndCrewDto,
} from "../dtos/movieDto";
import type { PersonWithRevenueDTO } from "../dtos/personDto";
import type { MovieRequestParams } from "./types/movieRequestParams";
import type { PaginationRequestParams } from "./types/paginationParams";
import type { Request, Response } from "express";

export class MovieController {
  private movieRepository: MovieRepositoryImpl;
  private movieUseCases: MovieUseCases;

  constructor() {
    this.movieRepository = new MovieRepositoryImpl();
    this.movieUseCases = new MovieUseCases(this.movieRepository);
  }

  public getMovies = async (req: Request, res: Response): Promise<void> => {
    try {
      const movieReqParams: MovieRequestParams = MovieRequestParamsSchema.parse(
        req.query,
      );

      const movies = await this.movieUseCases.getMovies(movieReqParams);
      const moviesDto: MovieDto[] = movies.map((movie) =>
        MovieDtoSchema.parse(convertObjectToCamelCase(movie)),
      );

      sendSuccess({
        res,
        message: "Movies retrieved successfully.",
        data: moviesDto,
      });
    } catch (error) {
      sendError({
        res,
        message: "Error on movieController.getMovies()",
        error,
      });
    }
  };

  public getMovieById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const movie = await this.movieUseCases.getMovieById(id);

      if (movie !== null) {
        const movieDto: MovieDto = MovieDtoSchema.parse(
          convertObjectToCamelCase(movie),
        );
        sendSuccess({
          res,
          message: `Movie with id ${id} retrieved successfully.`,
          data: movieDto,
        });
      } else {
        res.status(404).json({ error: `Movie with id ${id} not found.` });
      }
    } catch (error) {
      sendError({
        res,
        message: "Error on movieController.getMovieById()",
        error,
      });
    }
  };

  public getTopPeopleWithMostRevenue = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const personReqParams: PaginationRequestParams =
        PaginationRequestParamsSchema.parse(req.query);

      const peopleWithRevenue =
        await this.movieUseCases.getTopPeopleWithMostRevenue(personReqParams);
      const peopleWithRevenueDto: PersonWithRevenueDTO[] =
        peopleWithRevenue.map((person) =>
          PersonWithRevenueDTOSchema.parse(convertObjectToCamelCase(person)),
        );

      sendSuccess({
        res,
        message: "People with most revenue retrieved successfully.",
        data: peopleWithRevenueDto,
      });
    } catch (error) {
      sendError({
        res,
        message: "Error on movieController.getTopPeopleWithMostRevenue()",
        error,
      });
    }
  };

  public getTopMoviesWithTheMostKeyword = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const paginationParams: PaginationRequestParams =
        PaginationRequestParamsSchema.parse(req.query);

      const moviesWithMostKeyword =
        await this.movieUseCases.getTopMoviesWithTheMostKeyword(
          paginationParams,
        );
      const moviesWithMostKeywordDto: MovieWithMostKeywordDto[] =
        moviesWithMostKeyword.map((movie) =>
          MovieWithMostKeywordDtoSchema.parse(convertObjectToCamelCase(movie)),
        );

      sendSuccess({
        res,
        message: "Movies with most keyword retrieved successfully.",
        data: moviesWithMostKeywordDto,
      });
    } catch (error) {
      sendError({
        res,
        message: "Error on movieController.getTopMoviesWithTheMostKeyword()",
        error,
      });
    }
  };

  public getMovieCastAndCrew = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const castAndCrew = await this.movieUseCases.getMovieCastAndCrew(id);
      if (castAndCrew.length === 0) {
        res.status(404).json({ error: `Movie with id ${id} not found.` });
      }

      const castAndCrewDto: MovieCastAndCrewDto[] = castAndCrew.map((person) =>
        MovieCastAndCrewDtoSchema.parse({
          ...person,
          personName: person.name,
          jobName: person.job,
        }),
      );

      sendSuccess({
        res,
        message: `Cast and crew for movie with id ${id} retrieved successfully.`,
        data: castAndCrewDto,
      });
    } catch (error) {
      sendError({
        res,
        message: "Error on movieController.getMovieCastAndCrew()",
        error,
      });
    }
  };

  public createMovie = async (req: Request, res: Response): Promise<void> => {
    try {
      const movie = NewMovieDtoSchema.parse(req.body);
      const createdMovie = await this.movieUseCases.createMovie(movie);
      const createdMovieDto = NewMovieDtoSchema.parse(
        convertNestedObjectsToCamelCase(createdMovie, [
          "keywords",
          "categories",
          "languages",
          "casts",
          "trailers",
          "links",
          "countries",
        ]),
      );

      sendSuccess({
        res,
        message: "Movie created successfully.",
        data: createdMovieDto,
      });
    } catch (error) {
      sendError({
        res,
        message: "Error on movieController.createMovie()",
        error,
      });
    }
  };

  public deleteMovie = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedMovie = await this.movieUseCases.deleteMovie(id);

      if (deletedMovie !== null) {
        sendSuccess({
          res,
          message: `Movie with id ${id} deleted successfully.`,
          data: deletedMovie,
        });
      } else {
        res.status(404).json({ error: `Movie with id ${id} not found.` });
      }
    } catch (error) {
      sendError({
        res,
        message: "Error on movieController.deleteMovie()",
        error,
      });
    }
  };
}
