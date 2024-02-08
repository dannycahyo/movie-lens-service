import express from "express";
import * as movieController from "../interfaces/controllers/movieController";

const router = express.Router();

router.get("/movies", movieController.getMovies);
router.get("/movies/:id", movieController.getMovieById);

export default router;
