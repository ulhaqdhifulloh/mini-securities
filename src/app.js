const express = require('express');
const app = express()
const watchlistRoutes = require('./routes/watchlistRoutes')
const loggerMiddleware = require('./middlewares/logger')

const PORT = 3000;

// Middleware global
app.use(express.json()); // supaya bisa baca JSON body
app.use(loggerMiddleware); // pasang satpam logger

// Routing
app.use('/api/watchlist', watchlistRoutes); // semua rute akan berawalan /api/watchlist

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server Mini Sekuritas jalan di port ${PORT}`);
});