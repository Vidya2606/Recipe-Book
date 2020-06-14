const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;
const users = require('./users');
const recipe = require('./recipe');

app.use(cookieParser());
app.use(express.static('./public'));

// To get the recipe list
app.get('/recipe', (req, res) => {
    try {
        res.status(200).json(recipe.getRecipesList());
    } catch (err) {
        res.status(500).json({error: 'internal server error'});
    }
});

// To get the details of the recipe
app.get('/recipe/:recpId', (req, res) => {
    try {
        res.status(200).json(recipe.getRecipe(req.params.recpId));
    } catch(err) {
        res.status(500).json({error: 'internal server error'});
    }
})

// Login by creating a new uid.
app.post('/session', express.json(), (req, res) => {
    try {
        let uid = users.createUid(req.body.username);
        res.cookie("uid", {uid});
        res.status(200).json({uid: `${uid}`});
    } catch(err) {
        res.status(400).json({ error: 'bad login' });
    }
});

// To read uid from the server
app.get('/session', express.json(), (req, res) => {
    try {
        let username = users.validateRequest(req);
        res.status(200).json(username);
    } catch(err) {
        if (err === 'not authorized') {
            res.status(401).json({error: 'not authorized'});
        } else {
            res.status(500).json({error: 'internal server error'});
        }
    }
})

// Adding the new recipe
app.post('/recipe', express.json(), (req, res) => {
    try {
        let userName = users.validateRequest(req);
        recipe.addRecipe(req.body.title, userName, req.body.ingredients, req.body.instructions);
        res.status(200).json({});
    } catch(err) {
        res.status(400).json({ error: 'user must login' });
    }
});

//Logout
app.delete('/session', (req, res) => {
    try{
        let uid = req.cookies.uid;
        users.deleteUid(uid);
        res.clearCookie('uid');
        res.status(200).json({});
    } catch(err) {
        res.status(500).json({ code: 'internal server error' });
    }
})

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`) );