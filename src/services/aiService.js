const amqp = require('amqplib');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
require('dotenv').config();

// 1. Inisialisasi Otak AI (LangChain + Gemini)
const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite", // Model yang cepat dan murah
    apiKey: process.env.GEMINI_API_KEY
});

const QUEUE_NAME = 'trade_notifications';

const startAIConsumer = async () => {
    try {
        // 2. Konek ke RabbitMQ
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        
        console.log(`[🤖] AI Service menyala! Menunggu pesan di antrean: ${QUEUE_NAME}...`);

        // 3. Nongkrong dan Dengarkan Antrean
        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                // Baca isi pesannya
                const eventData = JSON.parse(msg.content.toString());
                console.log(`\n[📥] Pesan masuk dari Core Service: Transaksi ${eventData.stock_code}`);

                // 4. Proses dengan AI (LangChain)
                const prompt = `
                    Kamu adalah asisten AI pasar saham yang cerdas. 
                    User ID ${eventData.user_id} baru saja sukses membeli saham ${eventData.stock_code} sebanyak ${eventData.lot} lot dengan total harga Rp${eventData.total_price}.
                    Tolong buatkan 2 kalimat singkat:
                    1. Ucapan selamat atas transaksinya.
                    2. Insight singkat yang positif namun realistis tentang berinvestasi di saham bluechip (anggap saja saham tersebut bluechip).
                `;

                try {
                    console.log(`[⏳] AI sedang berpikir...`);
                    const response = await llm.invoke(prompt);
                    
                    console.log(`[✅] Hasil Analisis AI:`);
                    console.log(`====================================`);
                    console.log(response.content);
                    console.log(`====================================\n`);

                    // 5. PENTING: Laporan Selesai (Acknowledgement)
                    // Beritahu RabbitMQ bahwa pesan sudah diproses, silakan dihapus dari antrean.
                    channel.ack(msg);

                } catch (aiError) {
                    console.error("[❌] AI Gagal memproses:", aiError.message);
                    // Kalau AI gagal (misal API down), jangan di-ack, biar pesannya tetap ada di antrean
                    // dan bisa dicoba lagi nanti.
                }
            }
        });

    } catch (error) {
        console.error("[❌] Gagal konek ke RabbitMQ:", error);
    }
};

// Nyalakan service
startAIConsumer();