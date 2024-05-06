const express = require('express');
const session = require('express-session');
const router = express.Router();
require('dotenv').config();

router.use(session({
    secret: process.env.SECRET_KEY_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    }
}));

router.use((req, res, next) => {
    req.session.userActions = (req.session.userActions || 0) + 1;
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const lastActionDate = req.session.lastActionDate || currentDate;

    if (currentDate !== lastActionDate) {
        req.session.userActions = 1;
        req.session.lastActionDate = currentDate;
    }
    if (req.session.userActions > 10) {
        res.status(403).json({ message: 'Exceeded daily actions limit' });
    } else {
        const remainingActionsToday = 10 - req.session.userActions;
        console.log(`User actions so far today: ${req.session.userActions}`);
        console.log(`Remaining actions today: ${remainingActionsToday}`);

        const tomorrow = new Date(currentDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const actionsForTomorrow = 10 + remainingActionsToday;
        console.log(`Actions for tomorrow: ${actionsForTomorrow}`);

        req.session.actionsForTomorrow = actionsForTomorrow;
        req.session.save(); 

        next();
    }
});

router.use('/api/users', (req, res, next) => {
    next();
});

module.exports = router;