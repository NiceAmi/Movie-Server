const express = require('express');
const router = express.Router();
const authBLL = require('../BLL/authBLL');

router.post('/login', async (req, res) => {
  let obj = req.body;
  let response = await authBLL.logInUser(obj);

  if (response.success) {
    req.session.userId = response.data.id;
    req.session.username = response.data.username;

    res.cookie('session_id', req.sessionID, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: true,
    });
    res.send(response);
  } else {
    res.send(response);
  }
});

router.post('/register', async (req, res) => {
  let obj = req.body;
  let response = await authBLL.registerUser(obj);
  res.send(response);
});

module.exports = router;