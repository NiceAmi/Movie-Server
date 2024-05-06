const express = require('express');
const moviesBLL = require("../BLL/moviesBLL");
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const writeToLogFile = require('../logger');

router.get('/', async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        const userId = decodedToken.userId;
        if (req.session.actions) {
            const action = 'get all users movies';
            writeToLogFile(userId, req.session.actions, new Date(), action);
            console.log(req.session.actions);
        }
        const response = await moviesBLL.getAllMovies(token);
        res.send(response);
    } catch (error) {
        console.error("Error fetching all user movies:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/:movieId', async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        const userId = decodedToken.userId;
        const { movieId } = req.params;
        const response = await moviesBLL.getMovieById(token, movieId);
        const action = 'get movie by id';
        writeToLogFile(userId, req.session.actions, new Date(), action);
        console.log(req.session.actions);
        res.send(response);
    } catch (error) {
        console.error("Error fetching user movie by id:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/', async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        const userId = decodedToken.userId;
        const movie = req.body;
        const response = await moviesBLL.addNewMovie(token, movie);
        const action = 'post a new movie';
        writeToLogFile(userId, req.session.actions, new Date(), action);
        console.log(req.sessionID);
        res.send(response);
    } catch (error) {
        console.error("Error adding new movie:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/:movieId', async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        const userId = decodedToken.userId;
        const { movieId } = req.params;
        const movie = req.body;
        const response = await moviesBLL.updateMovie(token, movieId, movie);
        const action = 'updated movie';
        writeToLogFile(userId, req.session.actions, new Date(), action);
        console.log(req.sessionID);
        res.send(response);
    } catch (error) {
        console.error("Error updating movie:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/:movieId', async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        const userId = decodedToken.userId;
        const { movieId } = req.params;
        const response = await moviesBLL.deleteMovieById(token, movieId);
        const action = 'delete movie';
        writeToLogFile(userId, req.session.actions, new Date(), action);
        console.log(req.sessionID);
        res.send(response);
    } catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
