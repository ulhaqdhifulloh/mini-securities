require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

// Import file GraphQL
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

// Import Route REST API Lama
const loggerMiddleware = require('./middlewares/logger');
const watchlistRoutes = require('./routes/watchlistRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const startServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    // --- 1. MIDDLEWARE GLOBAL ---
    // WAJIB ADA untuk REST API kamu (/buy & /sell)
    app.use(express.json());
    app.use(cors());
    if (loggerMiddleware) app.use(loggerMiddleware);

    // --- 2. JALUR REST API ---
    app.use('/api/watchlist', watchlistRoutes);
    app.use('/api/transaction', transactionRoutes);

    // --- 3. INISIALISASI GRAPHQL ---
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true, // Wajib true biar UI muncul
    });

    await apolloServer.start();

    // --- 4. JALUR GRAPHQL (SOLUSI ERROR) ---
    // Di sini kita pasang cors() dan express.json() SECARA SPESIFIK untuk Apollo
    app.use(
        '/graphql',
        // 👇 TAMBAHKAN MIDDLEWARE PENYELAMAT INI 👇
        (req, res, next) => {
            if (req.body === undefined) {
                req.body = {}; // Kasih objek kosong biar Apollo nggak panik
            }
            next();
        },
        // 👆 ------------------------------------- 👆
        expressMiddleware(apolloServer)
    );

    // --- 5. 404 HANDLER ---
    app.use((req, res) => {
        res.status(404).json({ success: false, message: "Route tidak ditemukan!" });
    });

    // Nyalakan Server
    app.listen(PORT, () => {
        console.log(`🚀 REST API jalan di http://localhost:${PORT}/api`);
        console.log(`🔮 GraphQL jalan di http://localhost:${PORT}/graphql`);
    });
};

startServer();