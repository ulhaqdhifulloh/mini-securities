# 1. Ambil OS dasar yang ringan (Alpine Linux + Node.js v18)
FROM node:22-alpine

# 2. Bikin folder kerja di dalam kontainer
WORKDIR /app

# 3. Salin daftar belanjaan (package.json) dulu
# Kenapa dipisah? Supaya Docker bisa nge-cache installernya (biar build lebih cepat)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Salin semua kode project ke dalam kontainer
COPY . .

# 6. Buka port 3000 (Pintu akses)
EXPOSE 3000

# 7. Perintah saat kontainer dinyalakan
CMD ["npm", "start"]