const express = require('express');
const passport = require('passport')
const MoviesService = require('../services/movies');
const { movieIdSchema, updateMovieSchema, createMovieSchema  } = require('../utils/schemas/movies');
const validationHandler = require('../utils/mocks/middleware/validationHandler')
const scopesValidationHandler = require('../utils/mocks/middleware/scopesValidationHandler')
const cacheResponse = require('../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../utils/time');

//JWT strategies
require('../utils/auth/strategies/jwt')

function moviesApi (app) {
	const router = express.Router();
	app.use("/api/movies", router)

	const moviesService = new MoviesService();

	router.get("/",
		passport.authenticate('jwt', { session: false }),
		scopesValidationHandler(['read:movies']),
		async function (req, res, next) {
		cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
		const { tags } = req.query;
		try {
			const movies = await moviesService.getMovies({ tags })
			res.status(200).json({
				data: movies,
				message: "movies listed"
			})
		}catch (err){
			next(err);
		}
	})
	router.get("/:movieId",
		passport.authenticate('jwt', { session: false }),
		scopesValidationHandler(['read:movies']),
		validationHandler({ movieId: movieIdSchema }, 'params'),
		async function (req, res, next) {
		cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
		const { movieId } = req.params;
		try {
			const movies = await moviesService.getMovie({ movieId })
			res.status(200).json({
				data: movies,
				message: "movie retrieved"
			})
		}catch (err){
			next(err);
		}
	})
	router.post("/",
		passport.authenticate('jwt', { session: false }),
		scopesValidationHandler(['create:movies']),
		validationHandler(createMovieSchema),
		async function (req, res, next) {
		const { body: movie } = req
		try {
			const createMovieId = await moviesService.createMovie({ movie })
			res.status(201).json({
				data: createMovieId,
				message: "movie created"
			})
		}catch (err){
			next(err);
		}
	})
	router.put("/:movieId",
		passport.authenticate('jwt', { session: false }),
		scopesValidationHandler(['update:movies']),
		validationHandler({ movieId: movieIdSchema }, 'params'),
		validationHandler(updateMovieSchema),
		async function (req, res, next) {
		const { body: movie } = req;
		const { movieId } = req.params;
		try {
			const updatedMovieId = await moviesService.updateMovie({ movieId, movie })
			res.status(200).json({
				data: updatedMovieId,
				message: "movie updated"
			})
		}catch (err){
			next(err);
		}
	})
	router.delete("/:movieId",
		passport.authenticate('jwt', { session: false }),
		scopesValidationHandler(['delete:movies']),
		validationHandler({ movieId: movieIdSchema }, 'params'),
		async function (req, res, next) {
		const { movieId } = req.params;
		try {
			const deleteMovieId = await moviesService.deleteMovie({ movieId})
			res.status(200).json({
				data: deleteMovieId,
				message: "movie deleted"
			})
		}catch (err){
			next(err);
		}
	})
	router.patch("/:moviesID", async function(req, res, next) {
		const { movieId } = req.params;
		const { body: movie } = req;
		try {
			const updatedMovieId = await moviesService.updateMovie({ movieId, movie})
			res.status(200).json({
				data: updatedMovieId,
				message: "movie update"
			})
		}catch (err){
			next(err);
		}
	})
}

module.exports = moviesApi;
//db_user_platzivideos
//Nn8vG7E5IYa9E7ro