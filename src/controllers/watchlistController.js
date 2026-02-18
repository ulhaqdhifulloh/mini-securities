// Import koneksi DB
const db = require('../database/db');

// Ambil semua saham di watchlist
// Cara pakai: GET /api/watchlist?user_id=1
const getStocks = async (req, res) => {
try {
        const { user_id } = req.query; // Ambil dari Query URL

        if (!user_id) {
            return res.status(400).json({ error: "Parameter user_id wajib diisi! (Contoh: ?user_id=1)" });
        }

        // QUERY SQL: SELECT * FROM watchlists WHERE user_id = ...
        const data = await db('watchlists')
            .where({ user_id })
            .select('stock_code', 'target_price');

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ambil salah satu saham di list
// Cara pakai: GET /api/watchlist/BBCA?user_id=1
const getStock = async (req, res) => {
try {
        const { code } = req.params;
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ error: "Parameter user_id wajib diisi di query params!" });
        }

        const data = await db('watchlists')
            .where({ 
                stock_code: code.toUpperCase(),
                user_id: user_id 
            })
            .first() // ✅ Pakai .first() biar langsung dapat object, bukan array
            .select('stock_code', 'target_price');

        if (!data) { // Kalau first() ga nemu, dia return undefined
            return res.status(404).json({ error: "Saham tidak ditemukan di watchlistmu." });
        }

        res.status(200).json({ 
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tambah saham ke watchlist
// Cara pakai: POST /api/watchlist (Body JSON: { "user_id": 1, "code": "BBCA", "target_price": 7000})
const addStock = async (req, res) => {
try {
        const { user_id, code, target_price } = req.body;
        // Cek apakah saham terdaftar di bursa?
        const stockExists = await db('stocks')
            .where({ code: code.toUpperCase() })
            .first();

        // Validasi Input
        if (!user_id || !code || !target_price) {
            return res.status(400).json({ error: "Data tidak lengkap!" });
        }

        if (!stockExists) {
            return res.status(404).json({ 
                error: `Kode saham ${stock_code} tidak terdaftar di bursa efek!` 
            });
        }

        // QUERY SQL: INSERT INTO watchlists ...
        // Kita pakai .insert() dari Knex
        await db('watchlists').insert({
            user_id: user_id,
            stock_code: code.toUpperCase(),
            target_price: target_price
        });

        res.status(201).json({
            success: true,
            message: `Saham ${code.toUpperCase()} berhasil disimpan.`
        });
    } catch (error) {
        // Handle error duplicate (User udah pantau saham ini)
        if (error.code === '23505') { // Kode error PostgreSQL untuk Unique Violation
            return res.status(409).json({ error: "Saham ini sudah ada di watchlist kamu!" });
        }
        res.status(500).json({ error: error.message });
    }
};

// Hapus saham di watchlist
// Cara pakai: DELETE /api/watchlist/BBCA (Body JSON: { "user_id": 1 })
// Khusus DELETE, boleh pakai req.body atau req.query, tapi req.body lebih aman.
const deleteStock = async (req, res) => {
try {
        const { code } = req.params;
        const { user_id } = req.body; // Kita butuh tau siapa yg menghapus

        if (!user_id) return res.status(400).json({error: "Butuh user_id!"});

        // QUERY SQL: DELETE FROM watchlists WHERE ...
        const deletedCount = await db('watchlists')
            .where({ 
                stock_code: code.toUpperCase(),
                user_id: user_id 
            })
            .del();

        if (deletedCount === 0) {
            return res.status(404).json({ error: "Saham tidak ditemukan." });
        }

        res.status(200).json({ 
            success: true, 
            message: `Saham ${code} dihapus.` }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getStocks, getStock, addStock, deleteStock };