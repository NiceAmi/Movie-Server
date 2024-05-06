const express = require('express');
const usersBLL = require('../BLL/usersBLL');
const router = express.Router();
const writeToLogFile = require("../logger")
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.get('/', async (req, res) => {
    let token = req.headers['x-access-token'];
    let response = await usersBLL.getAllUsers(token);
    if (token) {
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        const userId = decodedToken.userId;
        const action = 'get all users';
        writeToLogFile(userId, req.session.actions, new Date(), action);
        console.log(req.session.actions);
    }
    res.send(response);
});

router.get('/:userId', async (req, res) => {
    let token = req.headers['x-access-token'];
    let { userId } = req.params;
    let response = await usersBLL.getUserById(token, userId);
    if (token) {
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        const userId = decodedToken.userId;
        const action = 'get user by id';
        writeToLogFile(userId, req.session.actions, new Date(), action);
        console.log(req.session.actions);
    }
    res.send(response);
});

router.put('/:userId', async (req, res) => {
    try {
        let token = req.headers['x-access-token'];
        let { userId } = req.params;
        let obj = req.body;

        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        const decodedUserId = decodedToken.userId;

        if (decodedUserId !== userId) {
            return res.status(403).json({ error: "Unauthorized access" });
        }
        let response = await usersBLL.updateUser(token, userId, obj);

        const action = 'update user';
        writeToLogFile(userId, req.session.actions, new Date(), action);
        console.log(req.session.actions);

        res.send(response);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/', async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const newUser = req.body;

        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        const userId = decodedToken.userId;

        const response = await usersBLL.addNewUser(token, userId, newUser);

        const action = 'add new user';
        writeToLogFile(userId, req.session.actions, new Date(), action);
        console.log(req.session.actions);

        res.send(response);
    } catch (error) {
        console.error("Error adding new user:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/:userId', async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const { userId } = req.params;

        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
        const requesterId = decodedToken.userId;

        const response = await usersBLL.deleteUser(token, requesterId, userId);

        const action = 'delete user';
        writeToLogFile(requesterId, req.session.actions, new Date(), action);
        console.log(req.session.actions);

        res.send(response);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;