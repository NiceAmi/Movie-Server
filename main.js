const express = require('express');
const cors = require('cors');
const authRouter = require('./Routers/authRouther');
const usersRouter = require('./Routers/usersRouter');
const moviesRouter = require('./Routers/moviesRouter');
const userMoviesRouter = require('./Routers/userMoviesRouter');
const tokenValidateRouter = require('./Routers/tokenValidateRouter');
const userActions = require('./Routers/userActionRouter');
const session = require('express-session');
require('dotenv').config();
const connectToDB = require('./Config/connectToDB');
connectToDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(userActions);

app.use(session({
  secret: process.env.SECRET_KEY_SESSION,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  },
}));

const incrementActionCount = (req, res, next) => {
  const actionsPerDay = 10;
  req.session.actions = req.session.actions || 0;
  if (req.session.actions) {
    req.session.actions++
  } else {
    req.session.actions = 1
  }

  if (req.session.actions >= actionsPerDay) {
    res.redirect('/login');
    return;
  }

  next();
};

app.use(incrementActionCount);
console.log(session);

app.use('/api/userMovies', userMoviesRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/tokenvalidate', tokenValidateRouter);

const port = 5000;

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
