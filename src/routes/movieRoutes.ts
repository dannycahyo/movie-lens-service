import express from "express";
import * as movieController from "../interfaces/controllers/movieController";

const router = express.Router();

router.get(
  "/movies/top-keyword",
  movieController.getTopMoviesWithTheMostKeyword,
);
router.get("/movies", movieController.getMovies);
router.get("/movies/:id", movieController.getMovieById);
router.get("/people/top-revenue", movieController.getTopPeopleWithMostRevenue);

export default router;
