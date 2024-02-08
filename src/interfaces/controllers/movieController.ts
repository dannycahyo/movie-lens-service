import { z } from "zod";
import { MovieUseCases } from "../../application/usecases/movieUseCases";
import { MovieDtoSchema, type MovieDto } from "../dtos/movieDto";
import {
  MovieRequestParamsSchema,
  type MovieRequestParams,
} from "./types/movieRequestParams";
import { MovieRepositoryImpl } from "../../infrastructure/database/movieRepositoryImpl";
import { convertObjectToCamelCase } from "../../utils/convertObjectToCamelCase";

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

    res.status(200).json(moviesDto);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Bad Request", details: error.errors });
      return;
    } else {
      console.error(`Error on movieController.getMovies(): ${error}`);
      res.status(500).json({ error: "Internal Server Error", details: error });
      return;
    }
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
      res.status(200).json(movieDto);
    } else {
      res.status(404).json({ error: `Movie with id ${id} not found.` });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Bad Request", details: error.errors });
      return;
    } else {
      console.error(`Error on movieController.getMovieById(): ${error}`);
      res.status(500).json({ error: "Internal Server Error", details: error });
      return;
    }
  }
};
