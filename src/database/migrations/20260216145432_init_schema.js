exports.up = function(knex) {
  return knex.schema
    // Tabel USERS
    .createTable('users', (table) => {
        table.increments('id').primary(); // ID 1, 2, 3...
        table.string('name').notNullable();
        table.decimal('balance', 14, 2).defaultTo(0); // Saldo
        table.timestamps(true, true);
    })
    // Tabel ORDERS
    .createTable('orders', (table) => {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('stock_code').notNullable();
        table.string('type').notNullable(); // Penanda ini order 'BUY' atau 'SELL'
        table.integer('lot').notNullable();
        table.decimal('price', 14, 2).notNullable(); // Harga per lembar
        table.decimal('total_amount', 14, 2).notNullable(); // Total bayar
        table.string('status').defaultTo('PENDING'); // PENDING / SUCCESS / FAILED
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('orders').dropTable('users');
};