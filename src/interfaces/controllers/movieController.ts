import { MovieUseCases } from "../../application/usecases/movieUseCases";
import {
  MovieDtoSchema,
  MovieWithMostKeywordDtoSchema,
} from "../dtos/movieDto";
import { PersonWithRevenueDTOSchema } from "../dtos/personDto";
import { MovieRequestParamsSchema } from "./types/movieRequestParams";
import { PaginationRequestParamsSchema } from "./types/paginationParams";
import { MovieRepositoryImpl } from "../../infrastructure/database/movieRepositoryImpl";
import { convertObjectToCamelCase } from "../../utils/convertObjectToCamelCase";
import { sendSuccess, sendError } from "../../utils/sendResponses";

import type { MovieDto, MovieWithMostKeywordDto } from "../dtos/movieDto";
import type { PersonWithRevenueDTO } from "../dtos/personDto";
import type { MovieRequestParams } from "./types/movieRequestParams";
import type { PaginationRequestParams } from "./types/paginationParams";
import type { Request, Response } from "express";

const movieRepository = new MovieRepositoryImpl();
const movieUseCases = new MovieUseCases(movieRepository);

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieReqParams: MovieRequestParams = MovieRequestParamsSchema.parse(
      req.query,
    );

    const movies = await movieUseCases.getMovies(movieReqParams);
    const moviesDto: MovieDto[] = movies.map((movie) =>
      MovieDtoSchema.parse(convertObjectToCamelCase(movie)),
    );

    sendSuccess({
      res,
      message: "Movies retrieved successfully.",
      data: moviesDto,
    });
  } catch (error) {
    sendError({ res, message: "Error on movieController.getMovies()", error });
  }
};

export const getMovieById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const movie = await movieUseCases.getMovieById(id);

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

export const getTopPeopleWithMostRevenue = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const personReqParams: PaginationRequestParams =
      PaginationRequestParamsSchema.parse(req.query);

    const peopleWithRevenue = await movieUseCases.getTopPeopleWithMostRevenue(
      personReqParams,
    );
    const peopleWithRevenueDto: PersonWithRevenueDTO[] = peopleWithRevenue.map(
      (person) =>
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

export const getTopMoviesWithTheMostKeyword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const paginationParams: PaginationRequestParams =
      PaginationRequestParamsSchema.parse(req.query);

    const moviesWithMostKeyword =
      await movieUseCases.getTopMoviesWithTheMostKeyword(paginationParams);
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
