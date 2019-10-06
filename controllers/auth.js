const jwt = require('jsonwebtoken');
require('dotenv').config();
const expressJwt = require('express-jwt');
const User = require('../models/user');

exports.signup = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) return res.status(403).json({
        error: "Email is taken"
    });
    const user = await new User(req.body);
    await user.save();
    res.json({ message: "User is registered!" });
};

exports.signin = (req, res) => {
    // Find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        // If error or no user
        if (err || !user) {
            return res.status(401).json({
                error: "User with that email does not exist. Please signup"
            });
        }

        // If user is found make sure the email and password match
        // create authenticate method in model and use here
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email or password doesn't match"
            });
        }

        // Generate a token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // Persist the token as 't' in cookie with expire date
        res.cookie('t', token, { expire: new Date() + 9999 });
        // return response with user and token to front-end client
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, email, name } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    return res.json({ message: "You just signout!" });
}

exports.requireSignin = expressJwt({
    // If the token is valid, express jwt appends the verified users id
    // in an auth key to the request object
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
});