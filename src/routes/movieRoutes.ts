import express from "express";
import { MovieController } from "../interfaces/controllers/movieController";

const movieController = new MovieController();
const router = express.Router();

router.get(
  "/movies/top-keyword",
  movieController.getTopMoviesWithTheMostKeyword,
);
router.get("/movies", movieController.getMovies);
router.post("/movies", movieController.createMovie);
router.get("/movies/:id/cast-crew", movieController.getMovieCastAndCrew);
router.get("/movies/:id", movieController.getMovieById);
router.get("/people/top-revenue", movieController.getTopPeopleWithMostRevenue);

export default router;
