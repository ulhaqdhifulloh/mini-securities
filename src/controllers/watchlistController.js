// Database sementara
let watchlist = [
    { code: 'BBCA', target_price: 9000},
    { code: 'TLKM', target_price: 4000}
];

// Ambil semua saham di watchlist
const getStocks = (req, res) => {
    res.status(200).json({
        success: true,
        data: watchlist
    });
};

// Ambil salah satu saham di list
const getStock = (req, res) => {
    const { code } = req.params; 

    // Cari index saham yang akan dihapus
    const stock = watchlist.find(item => item.code === code.toUpperCase());

    if (!stock) {
        return res.status(404).json({
            error: `Saham ${code.toUpperCase()} tidak ditemukan di watchlist`
        });
    }

    // Tampilkan jika ditemukan
    res.status(200).json({
        success: true,
        data: stock
    });
};

// Tambah saham ke watchlist
const addStock = (req, res) => {
    const { code, target_price } = req.body;

    // Validasi sementara (pengganti middleware)
    if (!code || !target_price) {
        return res.status(400).json({ error: "Code dan target price wajib diisi!"});
    }

    const newItem = { code: code.toUpperCase(), target_price }
    watchlist.push(newItem);

    res.status(201).json({
        success: true,
        message: `Saham ${code} berhasil ditambahkan ke watchlist`
    });
};

// Hapus saham di watchlist
const deleteStock = (req, res) => {
    const { code } = req.params;

    // Cari index saham yang akan dihapus
    const index = watchlist.findIndex(item => item.code === code.toUpperCase());

    if (index === -1) {
        return res.status(404).json({
            error: `Saham ${code} tidak ditemukan di watchlist`
        });
    }

    // Hapus dari array (database sementara) yang dibuat sebelumnya
    watchlist.splice(index, 1);

    res.status(200).json({
        success: true,
        message: `Saham ${code} berhasil dihapus`
    });
};

module.exports = { getStocks, getStock, addStock, deleteStock };