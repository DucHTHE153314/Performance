require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const showtimeRoutes = require('./routes/showtime.api');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 3500;

app.use(bodyParser.json());

app.use('/api/showtime', showtimeRoutes);

app.listen(port, () => {
    console.log(`Server setup: All done. Listening on port ${port}!`);
});
