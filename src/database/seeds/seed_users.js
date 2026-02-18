exports.seed = async function(knex) {
  // 1. Hapus data lama (Urutan PENTING! Hapus anak dulu baru induk)
  await knex('orders').del();      // Hapus riwayat transaksi
  await knex('portfolios').del();  // Hapus portofolio saham
  await knex('watchlists').del();  // Hapus watchlist
  await knex('users').del();       // Baru hapus usernya

  // 2. Masukkan User Baru
  await knex('users').insert([
    { id: 1, name: 'Multan', balance: 100000000 }, // 100 Juta
    { id: 2, name: 'Mulkin', balance: 50000 }   // 50 Ribu
  ]);

  // 3. Masukkan Portofolio Awal (Modal buat ngetes JUAL)
  // Ceritanya si Sultan udah punya saham BBCA dari lama
  await knex('portfolios').insert([
    { 
        user_id: 1, 
        stock_code: 'BBCA', 
        lot: 50 // Sultan punya 50 Lot BBCA
    },
    { 
        user_id: 1, 
        stock_code: 'GOTO', 
        lot: 1000 // Sultan punya 1000 Lot GOTO (nyangkut mungkin? xD)
    }
  ]);
  
  // Si Miskin (User 2) gak punya portofolio apa-apa (sedih)
};