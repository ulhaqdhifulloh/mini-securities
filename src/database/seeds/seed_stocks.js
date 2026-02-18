exports.seed = async function(knex) {
  // 1. Hapus data lama
  await knex('stocks').del();

  // 2. Masukkan Daftar Saham (Contoh LQ45 populer)
  await knex('stocks').insert([
    { code: 'BBCA', name: 'Bank Central Asia Tbk', sector: 'Finance' },
    { code: 'BBRI', name: 'Bank Rakyat Indonesia (Persero) Tbk', sector: 'Finance' },
    { code: 'BMRI', name: 'Bank Mandiri (Persero) Tbk', sector: 'Finance' },
    { code: 'BBNI', name: 'Bank Negara Indonesia (Persero) Tbk', sector: 'Finance' },
    { code: 'TLKM', name: 'Telkom Indonesia (Persero) Tbk', sector: 'Infrastructure' },
    { code: 'ASII', name: 'Astra International Tbk', sector: 'Industrial' },
    { code: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk', sector: 'Technology' },
    { code: 'UNVR', name: 'Unilever Indonesia Tbk', sector: 'Consumer Goods' },
    { code: 'ICBP', name: 'Indofood CBP Sukses Makmur Tbk', sector: 'Consumer Goods' },
    { code: 'ADRO', name: 'Adaro Energy Indonesia Tbk', sector: 'Energy' },
    { code: 'ANTM', name: 'Aneka Tambang Tbk', sector: 'Basic Materials' }
  ]);
};