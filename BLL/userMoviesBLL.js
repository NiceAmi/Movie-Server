const moviesModel = require("../Models/moviesModel");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getMoviesByUser = async (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        const userId = decodedToken.userId;
        const movies = await moviesModel.find({ uploadedBy: userId });
        return movies;
    } catch (error) {
        console.error("Error fetching movies by user:", error);
        throw error;
    }
};

module.exports = { getMoviesByUser };