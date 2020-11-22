const express = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const ProtectedRoutes = express.Router();

ProtectedRoutes.use((req, res, next) => {

    // check header for the token
    var token = req.body.token;

    // decode token
    if (token) {

        // verifies secret and checks if the token is expired
        jwt.verify(token , process.env.SECRET, (err, decoded) => {
            if (err) {
                return res.json({message: 'invalid token'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is not token
        res.send({message: 'No token provided'});
    }
})

module.exports = ProtectedRoutes;