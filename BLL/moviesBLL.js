const movieModel = require("../Models/moviesModel");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getAllMovies = async (token) => {
    let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    if (validate) {
        let movies = await movieModel.find({});
        if (movies) {
            return movies;
        } else {
            return "No movies found";
        }
    }
    return [];
};

const getMovieById = async (token, movieId) => {
    let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    if (validate) {
        let movie = await movieModel.findById(movieId);
        if (movie) {
            return movie;
        } else {
            return "No movie found";
        }
    }
};

const addNewMovie = async (token, obj) => {
    let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    if (validate) {
        const userId = validate.userId;
        obj.uploadedBy = userId;
        let movie = new movieModel(obj);
        await movie.save();
        return 'Created Successfully';
    }
};

const updateMovie = async (token, id, obj) => {
    let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    if (validate) {
        let { movieID } = validate;
        await movieModel.findByIdAndUpdate(id, obj);
        try {
            await movieModel.findByIdAndUpdate(movieID, obj);
            return 'Updated Successfully';
        } catch (error) {
            return 'Error in updating movie';
        }
    }
};

const deleteMovieById = async (token, id) => {
    let validate = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    if (validate) {
        let { movieID } = validate;
        await movieModel.deleteOne({ _id: id });
        try {
            await movieModel.deleteOne({ _id: movieID });
            return 'Deleted Successfully';
        } catch (error) {
            return 'Error in deleting movie';
        }
    }
}

module.exports = { getAllMovies, getMovieById, addNewMovie, updateMovie, deleteMovieById };