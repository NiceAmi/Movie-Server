const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    movieName: String,
    premiere: Date,
    director: String,
    movieLength: String,
    movieImage: String,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    versionKey: false
});

const moviesModel = mongoose.model('movie', movieSchema, 'movies');

module.exports = moviesModel;
