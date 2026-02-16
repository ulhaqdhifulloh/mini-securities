const express = require('express');
const router = express.Router();
const controller = require('../controllers/watchlistController');

// Definisi rute
// GET /api/watchlist
router.get('/', controller.getStocks);
// GET /api/watchlist/{code}
router.get('/:code', controller.getStock);
// POST /api/watchlist
router.post('/', controller.addStock);
// DELETE /api/watchlist/{code}
router.delete('/:code', controller.deleteStock);

module.exports = router;