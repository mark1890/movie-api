const express = require('express');
const app = express();
const moviesApi = require('./routes/movies');
const { config } = require('./config/index');
const { logErrors, errorHandler, wrapErrors } = require('./utils/mocks/middleware/errorHandlers');
const notFoundHandler = require('./utils/mocks/middleware/notFoundHandler')
const userMoviesApi = require('./routes/userMovies')
const authApi = require('./routes/auth')
const helmet = require('helmet')

//body parser
app.use(express.json())
app.use(helmet())
//routes
authApi(app)
moviesApi(app);
userMoviesApi(app)
//catch 404
app.use(notFoundHandler);
//Errors middlewares
app.use(logErrors);
app.use(wrapErrors)
app.use(errorHandler)





app.listen(config.port, function () {
	console.log(`Listening http://localhost:${config.port}`)
})