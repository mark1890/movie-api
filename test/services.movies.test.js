const { func } = require('@hapi/joi');
const assert = require('assert');
const proxyquire = require('proxyquire');
const MoviesService = require('../services/movies');

const { MongoLibMock, getAllStub } = require('../utils/mocks/mongoLib');
const { moviesMock } = require('../utils/mocks/movies');

describe('services - movies', function() {
	const MoviesServices = proxyquire('../services/movies', {
		'../lib/mongo': MongoLibMock
	})
	const movieService = new MoviesServices();
	describe('when getMovies methos is called', async function () {
		it('should call the getAll MongoLib method', async function () {
			await movieService.getMovies({})
			assert.strictEqual(getAllStub.called, true)
		})
		it('should return an array of movies', async function() {
			const result = await movieService.getMovies({})
			const expected = moviesMock;
			assert.deepEqual(result, expected)
		})
	})
})