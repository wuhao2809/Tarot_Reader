import express from "express";

const app = express();

import { auth } from "express-oauth2-jwt-bearer";



const port = process.env.PORT || 8080;

const jwtCheck = auth({
  audience: 'https://api.tarot',
  issuerBaseURL: 'https://dev-ubgvo6u0kn3yr2z1.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

app.get('/ping', function (req, res) {
    res.send('pong');
});

// enforce on all endpoints
app.use(jwtCheck);

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});



app.listen(port);

console.log('Running on port ', port);