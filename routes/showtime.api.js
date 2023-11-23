const express = require('express');

const showtimeController = require('../controllers/showtimeController');

const router = express.Router();

router.post("/performance", showtimeController.processPerformance);

module.exports = router;