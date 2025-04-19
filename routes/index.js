const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // check if user is logged in
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    // render home/dashboard page with user info
    res.render('pages/dashboard', {
        user: req.session.user
    });
});  

module.exports = router;
