const express = require('express');
const userMoviesBLL = require('../BLL/userMoviesBLL');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const writeToLogFile = require('../logger');

router.get('/', async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        if (token) {
            const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
            const userId = decodedToken.userId;
            const action = 'get the user movies';
            writeToLogFile(userId, req.session.actions, new Date(), action);
            console.log(req.sessionID);
        }
        const movies = await userMoviesBLL.getMoviesByUser(token);
        res.send(movies);
    } catch (error) {
        console.error("Error fetching user movies:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
