const express = require("express");
const router = express.Router();

router.get("/login",(req, res) => {
    // if the user has logged-in, redirect to index (homepage)
    if (req.session.user) {
        res.redirect('/');
    } else {
    res.render('pages/login', );
    }
});

router.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if ( username == "PeterGunawan" && password === "demon") {
        // implement sessions to check user is logged-in
        req.session.user = "admin";

        // redirect to member area
        res.redirect("/");
    } else {
        // redirect and render login page with error message
            return res.render("pages/login", {
                error: "Wrong username or password"
        });
    }
});

router.get('/moodtracker', (req, res) => {
    res.render('pages/mood-tracker')
}); 

router.get('/logout', (req, res) => {
    // Destroy all session
    req.session.destroy();

    // redirect to login
    res.redirect('/auth/login');
});

router.post('/mood', (req, res) => {
    const { mood, note } = req.body;
    const username = req.session.user.username;

    console.log(`User ${username} memilih mood: ${mood}`);
    if (note) {
        console.log(`Catatan: ${note}`);
    }

    // Sementara redirect ke dashboard lagi
    res.redirect('/');
});



module.exports = router;    