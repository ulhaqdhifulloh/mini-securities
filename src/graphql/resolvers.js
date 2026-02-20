const db = require('../database/db');

const resolvers = {
  // Mengurus permintaan dari type Query
  Query: {
    // Koki untuk pesanan "getAllMasterStocks"
    getAllMasterStocks: async () => {
      return await db('stocks').select('*');
    },

    // Koki untuk pesanan "getUserDashboard"
    getUserDashboard: async (_, { userId }) => {
      // 1. Ambil data user
      const user = await db('users').where({ id: userId }).first();
      if (!user) throw new Error("User tidak ditemukan");
      return user;
    }
  },

  // Ini MAGIC-nya GraphQL (Resolving Relations)
  // Ketika Frontend minta field "portfolios" di dalam "User", koki ini yang jalan
  User: {
    portfolios: async (parentUser) => {
      // parentUser.id berisi ID dari user yang sedang dicari
      return await db('portfolios').where({ user_id: parentUser.id });
    },
    orders: async (parentUser) => {
      return await db('orders')
        .where({ user_id: parentUser.id })
        .orderBy('created_at', 'desc')
        .limit(5); // Cuma ambil 5 order terakhir biar cepat
    }
  }
};

module.exports = resolvers;