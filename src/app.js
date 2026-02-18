require('dotenv').config();
const express = require('express');
const app = express()
const PORT = process.env.PORT;

const loggerMiddleware = require('./middlewares/logger')
const watchlistRoutes = require('./routes/watchlistRoutes')
const transactionRoutes = require('./routes/transactionRoutes')

// Middleware global
app.use(express.json()); // supaya bisa baca JSON body
app.use(loggerMiddleware); // pasang satpam logger

// Routing
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/transaction', transactionRoutes);

// --- 404 Handler (Kalau user akses route ngawur) ---
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route tidak ditemukan!"
    });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server Mini Sekuritas sedang berjalan di port ${PORT}`);
});