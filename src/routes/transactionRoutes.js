const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Definisi rute
// POST /api/transaction/buy
router.post('/buy', transactionController.buyStock);
// POST /api/transactions/sell
router.post('/sell', transactionController.sellStock);

module.exports = router;