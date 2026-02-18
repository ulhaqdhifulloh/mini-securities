# Panduan Deployment: Docker ke Server (AWS/Azure)

Berikut adalah langkah-langkah untuk memindahkan aplikasi dari laptop lokal ke server production menggunakan Docker.

## Tahap 1: Build Image

**Lokasi:** Laptop Kamu (Local)

Langkah ini membungkus aplikasimu menjadi *Image* yang portabel dan siap dikirim.

```bash
# Bikin image dengan tag 'v1'
docker build -t ulhaq/mini-sekuritas:v1 .

```

## Tahap 2: Push ke Registry

**Lokasi:** Laptop Kamu (Local)

Supaya server AWS bisa mengunduh *image* tersebut, kita perlu mengunggahnya ke Docker Hub (registry container, mirip GitHub tapi untuk Docker).

```bash
docker push ulhaq/mini-sekuritas:v1

```

---

## Tahap 3: Pull & Run

**Lokasi:** Terminal Server (via SSH ke AWS/Azure)

Setelah masuk ke server via SSH dan memastikan Docker sudah terinstall, lakukan langkah berikut:

### 1. Tarik Image

Ambil *image* terbaru yang sudah di-push tadi.

```bash
docker pull ulhaq/mini-sekuritas:v1

```

### 2. Jalankan Container (Deploy)

Di sinilah konfigurasi `.env` berperan.

> **PENTING:** Kita tidak mengirim file `.env` fisik ke server (karena alasan keamanan). Sebaliknya, kita "menginjeksi" variabel tersebut secara langsung saat menjalankan perintah `docker run`.

```bash
docker run -d \
  --name backend-app \
  -p 80:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=alamathost-database-aws.rds.amazonaws.com \
  -e DB_USER=admin \
  -e DB_PASS=password_super_rahasia \
  -e DB_NAME=prod_db \
  ulhaq/mini-sekuritas:v1

```

**Penjelasan Flag:**

* `-d`: Detached mode (berjalan di background).
* `-e`: Flag untuk memasukkan *Environment Variable*.
* `-p 80:3000`: Mapping port 80 (HTTP standar web) di server ke port 3000 (port aplikasi nodejs/internal).

---

## Alternatif Modern: Menggunakan Docker Compose

**Lokasi:** Terminal Server

Untuk manajemen yang lebih mudah, biasanya kita menggunakan file `docker-compose.prod.yml` (khusus production) di server.

1. Buat file `.env` secara manual di dalam server (berisi *secret variables*).
2. Jalankan perintah berikut:

```bash
docker-compose -f docker-compose.prod.yml up -d

```

*Docker compose akan otomatis membaca file `.env` yang ada di server tersebut, sehingga perintahnya lebih ringkas daripada `docker run` manual.*

---