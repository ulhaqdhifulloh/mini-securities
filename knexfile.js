// Load .env agar knex bisa baca variabel
require('dotenv').config(); 

module.exports = {
  // 1. DEVELOPMENT (Jalan di Laptop Local - npm run dev)
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1', // Default ke localhost
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 5432
    },
    migrations: { directory: './src/database/migrations' },
    seeds: { directory: './src/database/seeds' }
  },

  // 2. PRODUCTION (Jalan di Docker / Server AWS / Azure)
  production: {
    client: 'pg',
    connection: {
      // Di Docker/Prod, host biasanya bukan localhost, tapi URL dari provider atau nama service docker
      host: process.env.DB_HOST, 
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: { directory: './src/database/migrations' }
  },

  // Ubah nanti saat fase production
  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
