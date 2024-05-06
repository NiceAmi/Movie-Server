const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.get('/', async(req, res) => {
    let token = req.headers['x-access-token'];
    let resp = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    if(resp){
        res.send("Token found");
    }else{
        res.send("Token not found");
    }
})

module.exports = router;