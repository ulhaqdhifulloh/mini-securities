const typeDefs = `#graphql
  # 1. Definisi Tipe Data (Blueprint)
  type User {
    id: ID!
    name: String!
    balance: Float!
    portfolios: [Portfolio] # Relasi ke portofolio
    orders: [Order]         # Relasi ke riwayat order
  }

  type Portfolio {
    id: ID!
    stock_code: String!
    lot: Int!
  }

  type Order {
    id: ID!
    stock_code: String!
    type: String!
    lot: Int!
    price: Float!
    status: String!
    created_at: String
  }

  # 2. Definisi Query (Sama seperti GET di REST API)
  type Query {
    # Ambil dashboard lengkap milik satu user
    getUserDashboard(userId: ID!): User
    
    # Ambil semua daftar saham master
    getAllMasterStocks: [MasterStock]
  }

  type MasterStock {
    code: String!
    name: String!
    sector: String
  }
`;

module.exports = typeDefs;