const db = require('../database/db'); // Import koneksi Knex

// Beli Saham
// POST /api/transaction/buy {req.Body = user_id, stock_code, lot, price}
const buyStock = async (req, res) => {
    const { user_id, stock_code, lot, price } = req.body;
    const total_price = lot * 100 * price; // 1 Lot = 100 Lembar
    // Cek apakah saham terdaftar di bursa?
    const stockExists = await db('stocks').where({ code: stock_code.toUpperCase() }).first();

    if (!stockExists) {
        return res.status(404).json({ 
            error: `Kode saham ${stock_code} tidak terdaftar di bursa efek!` 
        });
    }

    try {
        // --- MULAI TRANSAKSI ---
        // Kita pakai trx, bukan db biasa
        await db.transaction(async (trx) => {
            // 1. Cek User & Saldo (Lock baris ini biar gak ada race condition)
            const user = await trx('users')
                .where({ id: user_id })
                .first()
                .forUpdate(); // PENTING: Kunci data user ini sampai transaksi selesai

            if (!user) {
                throw new Error("User tidak ditemukan");
            }

            if (parseFloat(user.balance) < total_price) {
                throw new Error(`Saldo kurang! Butuh Rp${total_price}, punya Rp${user.balance}`);
            }

            // 2. Kurangi Saldo User (Uang Keluar)
            await trx('users')
                .where({ id: user_id })
                .decrement('balance', total_price);

            // 3. Update Portfolio (Barang Masuk)
            // Cek dulu: User udah punya saham ini belum?
            const portfolio = await trx('portfolios')
                .where({ user_id, stock_code: stock_code.toUpperCase() })
                .first();

            if (portfolio) {
                // Kalau sudah punya, tambahkan jumlah lotnya
                await trx('portfolios')
                    .where({ id: portfolio.id })
                    .increment('lot', lot);
            } else {
                // Kalau belum punya, buat baris baru
                await trx('portfolios').insert({
                    user_id,
                    stock_code: stock_code.toUpperCase(),
                    lot: lot
                });
            }

            // 4. Catat Riwayat Order
            await trx('orders').insert({
                user_id: user_id,
                stock_code: stock_code.toUpperCase(),
                type: 'BUY',
                lot: lot,
                price: price,
                total_amount: total_price,
                status: 'SUCCESS'
            });
        });

        res.status(201).json({
            success: true,
            message: `Berhasil beli ${lot} lot ${stock_code.toUpperCase()}`
        });

    } catch (error) {
        // Kalau ada error di atas, otomatis ROLLBACK (Saldo balik, Order batal)
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Jual Saham
// POST /api/transaction/sell {req.Body = user_id, stock_code, lot, price}
const sellStock = async (req, res) => {
    const { user_id, stock_code, lot, price } = req.body;
    // Rumus Pendapatan: Lot * 100 lembar * Harga Jual
    const total_income = lot * 100 * price;

    try {
        await db.transaction(async (trx) => {
            // 1. Cek Portfolio (Punya barang gak?)
            const portfolio = await trx('portfolios')
                .where({ user_id, stock_code: stock_code.toUpperCase() })
                .first()
                .forUpdate(); // Kunci data biar gak dijual double di waktu bersamaan

            // Validasi: Kalau gak punya data atau lot kurang
            if (!portfolio || portfolio.lot < lot) {
                const sisa = portfolio ? portfolio.lot : 0;
                throw new Error(`Gagal Jual! Kamu cuma punya ${sisa} lot ${stock_code.toUpperCase()}`);
            }

            // 2. Tambah Saldo User (Uang Masuk)
            await trx('users').where({ id: user_id }).increment('balance', total_income);

            // 3. Kurangi Stock di Portfolio (Barang Keluar)
            await trx('portfolios')
                .where({ id: portfolio.id })
                .decrement('lot', lot);

            // 4. Catat Order Jual
            await trx('orders').insert({
                user_id: user_id,
                stock_code: stock_code.toUpperCase(),
                type: 'SELL',
                lot: lot,
                price: price,
                total_amount: total_income,
                status: 'SUCCESS'
            });
        });

        res.status(200).json({
            success: true,
            message: `Berhasil jual ${lot} lot ${stock_code.toUpperCase()}. Saldo +Rp${total_income}`,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { buyStock, sellStock };