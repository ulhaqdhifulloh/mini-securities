exports.up = function(knex) {
  return knex.schema.createTable('watchlists', (table) => {
    table.increments('id').primary();
    // Relasi: Watchlist ini punya siapa? (Link ke tabel users)
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('stock_code', 4).notNullable(); // Kode saham (BBCA)
    table.decimal('target_price', 14, 2).notNullable(); // Harga incaran
    table.timestamps(true, true);

    // Unik: Satu user tidak boleh memantau saham yang sama 2x
    table.unique(['user_id', 'stock_code']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('watchlists');
};