exports.up = function(knex) {
  return knex.schema.createTable('stocks', (table) => {
    // Kita jadikan 'code' sebagai Primary Key karena kode saham itu unik
    table.string('code', 4).primary(); // Contoh: 'BBCA', 'TLKM'
    table.string('name').notNullable(); // Contoh: 'Bank Central Asia Tbk'
    table.string('sector').nullable();  // Contoh: 'Finance', 'Technology'
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('stocks');
};