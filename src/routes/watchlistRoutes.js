const express = require('express');
const router = express.Router();
const watchlistController= require('../controllers/watchlistController');

// Definisi rute
// GET /api/watchlist
router.get('/', watchlistController.getStocks);
// GET /api/watchlist/{code}
router.get('/:code', watchlistController.getStock);
// POST /api/watchlist
router.post('/', watchlistController.addStock);
// DELETE /api/watchlist/{code}
router.delete('/:code', watchlistController.deleteStock);

module.exports = router;