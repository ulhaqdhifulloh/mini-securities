# 📈 Mini Sekuritas API 

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A robust, scalable backend service simulating a stock brokerage platform. This project implements modern software architecture patterns including ACID-compliant transactions, an Event-Driven AI integration via Message Brokers, and a GraphQL API Gateway.

## 🚀 Key Features

* **Financial Grade Transactions (ACID):** Ensures strict data integrity for stock purchasing and selling logic to prevent balance discrepancies.
* **Event-Driven Architecture:** Utilizes RabbitMQ to decouple core trading services from background tasks, ensuring high performance.
* **AI-Powered Trade Analysis:** Integrates LangChain.js and Google Gemini to generate automated, real-time market sentiment analysis upon successful transactions.
* **API Gateway (GraphQL):** Resolves overfetching and underfetching by providing a unified, declarative endpoint for client applications (Mobile/Web dashboards).
* **Containerized Environment:** Fully dockerized infrastructure for PostgreSQL and RabbitMQ to guarantee consistency across development and production.

## 🏗️ System Architecture

1.  **Phase 1 (Core):** RESTful API for Watchlist management (CRUD).
2.  **Phase 2 (Database):** PostgreSQL integration with Knex.js query builder and migration/seeding.
3.  **Phase 3 (Containerization):** Dockerizing stateful services.
4.  **Phase 4 (Microservices & AI):** RabbitMQ for asynchronous messaging, AI worker service, and Apollo Server (GraphQL).

## 🛠️ Tech Stack

* **Language & Framework:** JavaScript, Node.js, Express.js
* **Database & ORM:** PostgreSQL, Knex.js
* **Message Broker:** RabbitMQ (`amqplib`)
* **AI Integration:** LangChain.js, Google Gemini API
* **API Layer:** REST API, GraphQL (Apollo Server v4)

## 🚦 Prerequisites

Ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Docker](https://www.docker.com/) & Docker Compose
* [PostgreSQL](https://www.postgresql.org/) (If running the database natively)

## 📦 Installation & Setup

**1. Clone the repository**
```bash
git clone [https://github.com/ulhaqdhifulloh/mini-sekuritas.git](https://github.com/ulhaqdhifulloh/mini-sekuritas.git)
cd mini-sekuritas

```

**2. Install Dependencies**

```bash
npm install

```

**3. Environment Configuration**
Create a `.env` file in the root directory based on the `.env.example`:

```bash
cp .env.example .env

```

*Fill in your PostgreSQL credentials and Gemini API Key in the `.env` file.*

**4. Spin up Infrastructure (RabbitMQ)**

```bash
docker-compose up -d

```

**5. Database Migration & Seeding**

```bash
npx knex migrate:latest
npx knex seed:run

```

**6. Start the Services**
You need to run the Core API and the AI Consumer service simultaneously. Open two terminals:

```bash
# Terminal 1: Start the Core API & GraphQL
npm run dev

# Terminal 2: Start the AI Worker
node src/services/aiService.js

```

## 🌐 API Documentation

### GraphQL Endpoint (`/graphql`)

Access the Apollo Sandbox UI to test queries at `http://localhost:3000/graphql`.

**Example Query: Get User Dashboard**

```graphql
query GetDashboard {
  getUserDashboard(userId: "1") {
    name
    balance
    portfolios {
      stock_code
      lot
    }
  }
}

```

### REST Endpoints (`/api`)

* `POST /api/transaction/buy` - Execute a stock purchase.
* `POST /api/transaction/sell` - Execute a stock sale.
* `GET /api/watchlist?user_id=1` - Get user's watchlist.

*(Testing can be done via Postman or cURL)*

## 👨‍💻 Author

**Dhifulloh Dhiya Ulhaq**

* LinkedIn: [linkedin.com/in/ulhaqdhifulloh](https://www.google.com/search?q=https://www.linkedin.com/in/ulhaqdhifulloh)
* GitHub: [@ulhaqdhifulloh](https://www.google.com/search?q=https://github.com/ulhaqdhifulloh)

---

*Built with passion and best practices.*