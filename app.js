const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// DB Connection
mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .then(() => {
        console.log('DB Connected!');
    });
mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
});

// Routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
// Api Doc
app.get('/', (req, res) => {
    fs.readFile('docs/api.Docs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use('/', postRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'You are not authorized' });
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Api is running on port: ${port}`));
