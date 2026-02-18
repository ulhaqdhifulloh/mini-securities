exports.up = function(knex) {
  return knex.schema.createTable('portfolios', (table) => {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('stock_code', 4).notNullable();
    table.integer('lot').defaultTo(0); // Jumlah lot yang dimiliki
    table.timestamps(true, true);

    // Constraint Unik: Satu user cuma punya 1 baris untuk setiap kode saham
    // (Gak boleh ada 2 baris User 1 punya BBCA)
    table.unique(['user_id', 'stock_code']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('portfolios');
};