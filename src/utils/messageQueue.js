// src/utils/messageQueue.js
const amqp = require('amqplib');
require('dotenv').config();

const QUEUE_NAME = 'trade_notifications'; // Nama antreannya

const publishMessage = async (message) => {
    try {
        // 1. Konek ke server RabbitMQ
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        
        // 2. Bikin jalur komunikasi (Channel)
        const channel = await connection.createChannel();
        
        // 3. Pastikan antreannya ada (kalau belum ada, otomatis dibikinin)
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        
        // 4. Lempar pesan ke antrean (Pesan harus berbentuk Buffer/String)
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
        
        console.log(`[x] Pesan berhasil dikirim ke antrean:`, message);
        
        // 5. Tutup koneksi (Biar hemat memory)
        setTimeout(() => {
            connection.close();
        }, 500);

    } catch (error) {
        console.error("Gagal mengirim pesan ke RabbitMQ:", error);
    }
};

module.exports = { publishMessage };