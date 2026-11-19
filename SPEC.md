# SPEC.md — JahitSuka

Katalog bisnis jahit berbasis web untuk latihan satu hari.

| Field | Nilai |
| --- | --- |
| Nama produk | RasaNusa |
| Jenis | Aplikasi web statis (demo/latihan) |
| Tech stack | Vite, JavaScript vanilla, HTML, CSS, localStorage |
| Status dokumen | Final untuk MVP latihan |
| Versi | 1.0 |

---

## 1. Tujuan

Membuat aplikasi katalog jasa jahit bernama **RasaNusa** yang dapat digunakan untuk:

1. Menampilkan 8 layanan/produk jahit contoh beserta foto/placeholder lokal, kategori, harga Rupiah, stok, dan deskripsi.
2. Memudahkan calon pelanggan menemukan layanan melalui pencarian, filter kategori, dan pengurutan.
3. Memungkinkan calon pelanggan mengirim pesan pemesanan melalui tautan WhatsApp (bukan WhatsApp API).
4. Memberi pengalaman mengelola data (tambah, ubah, hapus) melalui dashboard demo pada satu perangkat, dengan penyimpanan localStorage.

Aplikasi ini **hanya untuk latihan dan demo**, bukan sistem produksi toko.

### Sasaran pembelajaran

- Membangun UI katalog dari data terstruktur dengan JavaScript vanilla.
- Menerapkan pencarian, filter, sorting, dan validasi form tanpa framework.
- Menerapkan pola CRUD + persistensi localStorage.
- Menulis kriteria penerimaan yang dapat diperiksa manual.

### Definisi "selesai" untuk MVP

Seluruh kriteria penerimaan pada Bagian 9 lulus pemeriksaan manual pada satu peramban, tanpa backend, tanpa login, dan tanpa API key.

---

## 2. Pengguna

| Pengguna | Kebutuhan utama | Cara akses |
| --- | --- | --- |
| Calon pelanggan | Melihat katalog, mencari/menyaring layanan, melihat harga & stok, memesan via WhatsApp | Langsung membuka halaman katalog |
| Pengelola toko (satu perangkat) | Menambah, mengubah, menghapus layanan; melihat ringkasan total layanan dan stok | Berpindah ke tab Dashboard pada perangkat yang sama |

Catatan:

- Tidak ada autentikasi, peran, atau login — termasuk login palsu.
- Dashboard bukan area terproteksi; pada perangkat ini siapa pun yang memegang perangkat dapat mengelola data.
- Data hanya berlaku pada peramban/perangkat tersebut (localStorage), tidak disinkronkan.

---

## 3. Ruang Lingkup & Daftar Fitur

### 3.1 Fitur MVP (wajib)

| ID | Fitur | Ringkasan perilaku |
| --- | --- | --- |
| F-01 | Katalog 8 layanan | Menampilkan 8 data contoh jahit dalam grid kartu |
| F-02 | Foto/placeholder lokal | Setiap kartu menampilkan gambar lokal; gambar gagal dimuat diganti placeholder lokal |
| F-03 | Informasi layanan | Nama, kategori, harga Rupiah, stok, deskripsi tampil pada kartu |
| F-04 | Pencarian | Mencari berdasarkan nama, kategori, dan deskripsi (tidak peka huruf besar/kecil) |
| F-05 | Filter kategori | Menyaring berdasarkan satu kategori; opsi "Semua kategori" untuk menampilkan seluruh data |
| F-06 | Sorting | Mengurutkan: Unggulan dulu (default), Harga terendah, Harga tertinggi, Nama A–Z, Stok terbanyak |
| F-07 | Tombol WhatsApp | Membuka `wa.me` dengan pesan pemesanan terisi otomatis (nama + harga layanan) |
| F-08 | Dashboard CRUD | Form tambah, ubah, hapus layanan dengan konfirmasi hapus |
| F-09 | Ringkasan dashboard | Total layanan, total stok, jumlah stok habis, jumlah kategori |
| F-10 | localStorage | Seluruh perubahan CRUD tersimpan dan bertahan setelah refresh |
| F-11 | Keadaan kosong | Pesan dan aksi pemulihan saat hasil pencarian kosong atau daftar layanan kosong |

### 3.2 Perilaku detail

**F-04 Pencarian**

- Input pencarian memfilter saat mengetik (tanpa tombol submit).
- Kata kunci dicocokkan sebagai substring pada `nama`, `kategori`, dan `deskripsi`.
- Pencarian dan filter kategori berlaku bersamaan (AND).
- Pencarian yang menghasilkan 0 item menampilkan keadaan kosong dan tombol "Bersihkan pencarian".

**F-05 Filter kategori**

- Kategori baku: `Wanita`, `Pria`, `Seragam`, `Permak`, `Aksesori`.
- Opsi filter: `Semua kategori` + 5 kategori di atas.
- Pilihan kategori pada form CRUD dibatasi pada daftar baku yang sama.

**F-06 Sorting**

| Opsi | Aturan |
| --- | --- |
| Unggulan dulu (default) | `unggulan = true` lebih dulu, lalu Nama A–Z |
| Harga terendah | `harga` menaik, lalu Nama A–Z |
| Harga tertinggi | `harga` menurun, lalu Nama A–Z |
| Nama A–Z | `nama` menaik (locale `id`) |
| Stok terbanyak | `stok` menurun, lalu Nama A–Z |

Sorting diterapkan setelah filter. Sorting tidak mengubah data tersimpan maupun urutan di dashboard.

**F-07 Tombol WhatsApp**

- Tautan: `https://wa.me/<nomor-contoh>?text=<pesan-terenkode>`.
- Isi pesan: `Halo RasaNusa, saya ingin memesan <nama> (<harga Rupiah>). Apakah masih tersedia?`
- Dibuka di tab baru (`target="_blank"`, `rel="noopener noreferrer"`).
- Nomor telepon adalah **nomor contoh fiktif** yang ditulis di kode, bukan nomor pribadi dan bukan API key.
- Tidak ada WhatsApp API, tidak ada pengiriman otomatis, tidak ada pembayaran.
- Bila `stok = 0`, tombol diganti tombol nonaktif berlabel "Stok habis" dan tidak dapat diklik.

**F-08 Dashboard CRUD**

- Form memiliki field: nama, kategori, harga, stok, deskripsi, URL gambar (opsional), unggulan (checkbox).
- Mode tambah: form kosong, tombol "Simpan layanan".
- Mode ubah: form terisi data terpilih, judul "Ubah layanan", tombol "Simpan perubahan", tersedia tombol "Batal".
- Tombol "Ubah" dan "Hapus" tersedia pada setiap baris tabel dashboard.
- Hapus memunculkan dialog konfirmasi berisi nama layanan; penghapusan hanya terjadi setelah konfirmasi.
- Setelah tambah/ubah/hapus, katalog, tabel, dan ringkasan langsung diperbarui tanpa reload.
- Notifikasi singkat (toast) ditampilkan setelah aksi berhasil.

**F-09 Ringkasan dashboard**

| Kartu | Perhitungan |
| --- | --- |
| Total layanan | Jumlah baris data |
| Total stok | Jumlah seluruh `stok` |
| Stok habis | Jumlah layanan dengan `stok = 0` |
| Kategori | Jumlah kategori unik yang dipakai data saat ini |

**F-10 Persistensi**

- Kunci localStorage: `rasanusa.products.v1`.
- Nilai: array JSON berisi objek produk sesuai model data.
- Saat aplikasi dibuka dan kunci belum ada / rusak: gunakan 8 data contoh.
- Array kosong (`[]`) adalah kondisi sah (semua data dihapus) dan **tidak** boleh diisi ulang otomatis dengan data contoh.
- Tombol "Muat ulang data contoh" mengembalikan 8 data contoh setelah konfirmasi pengguna.

---

## 4. Model Data

### 4.1 Entitas Produk

| Field | Tipe | Wajib | Aturan validasi | Contoh |
| --- | --- | --- | --- | --- |
| `id` | string | Ya | Unik, dibuat aplikasi, tidak diedit pengguna | `"p-kebaya"`, `"p-lx3k9a2f"` |
| `nama` | string | Ya | Setelah trim, panjang 3–70 karakter | `"Kebaya Modern Bordir"` |
| `kategori` | string | Ya | Salah satu dari 5 kategori baku | `"Wanita"` |
| `harga` | number | Ya | Bilangan hingga, `>= 0`; disimpan tanpa format titik/rupiah | `450000` |
| `stok` | number | Ya | Bilangan bulat, `>= 0` | `6` |
| `deskripsi` | string | Ya | Setelah trim, panjang 5–240 karakter | `"Kebaya brokat..."` |
| `imageUrl` | string | Ya (boleh kosong saat input) | Bila kosong → placeholder lokal; bila diisi harus diawali `http://`, `https://`, atau `/` | `"/images/kebaya.svg"` |
| `unggulan` | boolean | Ya | `true` / `false`; default `false` | `true` |

### 4.2 Bentuk JSON

```json
{
  "id": "p-kebaya",
  "nama": "Kebaya Modern Bordir",
  "kategori": "Wanita",
  "harga": 450000,
  "stok": 6,
  "deskripsi": "Kebaya potong modern dengan bordir bunga di bagian dada.",
  "imageUrl": "/images/kebaya.svg",
  "unggulan": true
}
```

### 4.3 Aturan validasi form

- Validasi dilakukan sebelum data disimpan; pesan kesalahan ditampilkan di dalam form.
- `harga` negatif, kosong, atau bukan angka → ditolak dengan pesan "Harga wajib berupa angka dan tidak boleh kurang dari 0."
- `stok` negatif, desimal, kosong, atau bukan angka → ditolak dengan pesan "Stok wajib bilangan bulat dan tidak boleh kurang dari 0."
- `nama` < 3 karakter → ditolak.
- `deskripsi` < 5 karakter → ditolak.
- `kategori` di luar daftar baku → ditolak.
- Input yang ditolak tidak mengubah state maupun localStorage.
- Data dari localStorage yang tidak berbentuk array dianggap rusak → fallback ke data contoh.

### 4.4 Data contoh (8 item)

| # | Nama | Kategori | Harga | Stok | Unggulan |
| --- | --- | --- | --- | --- | --- |
| 1 | Kebaya Modern Bordir | Wanita | 450.000 | 6 | Ya |
| 2 | Batik Pria Lengan Panjang | Pria | 275.000 | 12 | Ya |
| 3 | Dress Lurik Harian | Wanita | 320.000 | 5 | Tidak |
| 4 | Kemeja Tenun Klasik | Pria | 290.000 | 8 | Tidak |
| 5 | Seragam Sekolah (Set) | Seragam | 185.000 | 20 | Ya |
| 6 | Permak & Veting Celana | Permak | 65.000 | 30 | Tidak |
| 7 | Rok Songket Pesta | Wanita | 510.000 | 4 | Ya |
| 8 | Tas Kanvas Bordir | Aksesori | 150.000 | 9 | Tidak |

Gambar: satu berkas SVG lokal per item di `public/images/`, ditambah `placeholder.svg` sebagai cadangan. Seluruh data bersifat fiktif dan nonpribadi.

---

## 5. Kebutuhan Nonfungsional

| ID | Aspek | Kebutuhan | Cara memeriksa |
| --- | --- | --- | --- |
| NF-01 | Platform | Berjalan di peramban modern (Chrome/Edge/Firefox versi terbaru) | Buka aplikasi di peramban |
| NF-02 | Build | Proyek Vite dapat `npm install` dan `npm run build` tanpa error | Jalankan kedua perintah |
| NF-03 | Tanpa backend | Tidak ada server, database, atau panggilan API data | Periksa tab Network: hanya aset statis |
| NF-04 | Tanpa API key | Tidak ada API key/secret/token di kode maupun localStorage | Cari `key`, `token`, `secret` pada kode; periksa localStorage |
| NF-05 | Privasi | Tidak meminta data pribadi; nomor WhatsApp adalah nomor contoh | Inspeksi form dan tautan |
| NF-06 | Aksesibilitas dasar | Navigasi keyboard, label pada input, `alt` pada gambar, kontras teks memadai, `aria-live` untuk hasil | Uji Tab/Enter dan pembaca layar dasar |
| NF-07 | Responsif | Layout nyaman pada lebar 360 px hingga desktop | Ubah ukuran jendela |
| NF-08 | Kinerja | Interaksi filter/sorting terasa instan (< 100 ms pada 8–50 item) | Uji manual |
| NF-09 | Ketahanan data | Refresh tidak menghilangkan data; data rusak tidak membuat halaman blank | Refresh; ubah nilai localStorage secara manual |
| NF-10 | Keamanan render | Teks dari pengguna di-escape sebelum dirender (tidak ada HTML injection) | Simpan nama berisi `<b>uji</b>` → tampil sebagai teks |
| NF-11 | Kejelasan status | Aksi berhasil/gagal memberi umpan balik (toast atau pesan form) | Lakukan CRUD |
| NF-12 | Batas data | Minimal 1 dan maksimal 50 layanan untuk kenyamanan demo | Tambah hingga 50 item |

---

## 6. Arsitektur & Struktur Berkas (rencana)

```text
rasanusa/
├─ index.html            # shell: header, tab, katalog, dashboard, dialog, toast
├─ package.json          # skrip dev/build/preview, dependensi Vite
├─ public/
│  └─ images/            # 8 SVG produk + placeholder.svg + favicon.svg
└─ src/
   ├─ main.js            # state UI, render katalog/dashboard, event handler, validasi
   ├─ data.js            # kategori baku, nomor WA contoh, 8 data contoh
   ├─ store.js           # load/save/reset localStorage + pembuat id
   ├─ utils.js           # format Rupiah, escape HTML, tautan WhatsApp
   └─ style.css          # seluruh styling
```

Prinsip:

- Satu sumber kebenaran data di memori (`products`), disinkronkan ke localStorage setiap perubahan.
- Render ulang bagian yang berubah setelah mutasi; tanpa reload halaman.
- Tidak ada framework, router, maupun state library.

---

## 7. Risiko & Mitigasi

| ID | Risiko | Dampak | Mitigasi |
| --- | --- | --- | --- |
| R-01 | localStorage penuh/diblokir (mode privat, kuota) | Data tidak tersimpan | Tangkap error penyimpanan, tampilkan pesan, jangan mengklaim berhasil |
| R-02 | Data localStorage rusak/versi lama | Halaman gagal render | Parse dalam `try/catch`; fallback ke data contoh bila bukan array |
| R-03 | Nomor WhatsApp contoh tidak aktif | Pesan tidak terkirim | Beri keterangan bahwa nomor hanya contoh; tombol tetap mengarah ke `wa.me` |
| R-04 | Harga/stok dimasukkan tidak wajar (mis. 1e12) | Tampilan ringkasan kacau | Validasi angka hingga dan batas praktis; tampilkan pesan |
| R-05 | Data hilang karena pengguna menghapus semua item | Katalog kosong | Sediakan "Muat ulang data contoh" dengan konfirmasi |
| R-06 | Nomor pribadi tidak sengaja dipakai | Masalah privasi | Gunakan nomor fiktif; jangan menyimpan kontak asli |
| R-07 | Kebocoran API key | Risiko keamanan | Larangan keras menyimpan API key; tidak ada integrasi pihak ketiga |
| R-08 | XSS melalui nama/deskripsi/URL gambar | Eksekusi skrip | Escape semua teks; URL gambar divalidasi awalan protokol |
| R-09 | Persepsi "login" palsu oleh pengguna awam | Salah paham keamanan | Tidak ada UI login; dashboard diberi label "Area pengelola · demo" |
| R-10 | Perbedaan format angka antar-locale | Harga salah tampil | Format Rupiah terpusat pada satu util (`id-ID`) |

---

## 8. Out of Scope

Tidak dibuat pada MVP ini:

- Backend, API data, database, server-side rendering.
- Login, registrasi, peran pengguna, sesi, hingga login palsu.
- Pembayaran online, keranjang, checkout, ongkos kirim.
- WhatsApp API/otomasi pesan; hanya tautan `wa.me`.
- Sistem pengiriman, pelacakan pesanan, stok otomatis setelah pesan.
- Multi-user, sinkronisasi antarperangkat, cloud sync.
- Upload file gambar (hanya URL/path lokal).
- Panel analitik, laporan penjualan, ekspor/impor berkas.
- SEO lanjutan, PWA/offline, internasionalisasi.

---

## 9. Acceptance Criteria (dapat diperiksa manual)

Prasyarat: jalankan `npm install` lalu `npm run dev`, buka URL yang ditampilkan. Kecuali disebut lain, mulai dari tab **Katalog** dengan localStorage kosong.

| ID | Skenario | Langkah manual | Hasil yang diharapkan | Terkait |
| --- | --- | --- | --- | --- |
| AC-01 | Katalog awal | Buka aplikasi pertama kali | 8 kartu layanan tampil, masing-masing dengan foto/placeholder, nama, kategori, harga Rupiah, stok, deskripsi | F-01, F-02, F-03 |
| AC-02 | Pencarian nama | Ketik `kebaya` pada kolom cari | Hanya kartu yang namanya/deskripsinya mengandung "kebaya" yang tampil; jumlah hasil diperbarui | F-04 |
| AC-03 | Pencarian tanpa hasil | Ketik `zzz` | Tidak ada kartu; muncul keadaan kosong dan tombol "Bersihkan pencarian" | F-04, F-11 |
| AC-04 | Bersihkan pencarian | Klik "Bersihkan pencarian" | Kolom cari dan filter kembali ke default; 8 kartu tampil lagi | F-04, F-11 |
| AC-05 | Filter kategori | Pilih kategori `Wanita` | Hanya layanan berkategori Wanita (3 item) yang tampil | F-05 |
| AC-06 | Filter + pencarian | Kategori `Wanita` + kata kunci `songket` | Hanya "Rok Songket Pesta" tampil | F-04, F-05 |
| AC-07 | Sorting harga | Pilih "Harga terendah", lalu "Harga tertinggi" | Urutan harga menaik, lalu menurun; harga tiap kartu terlihat | F-06 |
| AC-08 | Sorting nama & stok | Pilih "Nama A–Z", lalu "Stok terbanyak" | Urutan alfabetis; lalu stok terbesar di awal | F-06 |
| AC-09 | Harga & stok terlihat | Amati kartu | Harga berformat `Rp 450.000`; stok tampil sebagai angka/status; stok 0 berlabel "Stok habis" | F-03 |
| AC-10 | Tombol WhatsApp | Klik "Pesan via WhatsApp" pada satu kartu | Tab baru membuka `wa.me` dengan pesan berisi nama dan harga layanan | F-07 |
| AC-11 | Tambah layanan | Dashboard → isi semua field valid → "Simpan layanan" | Toast sukses; layanan baru muncul di tabel dan katalog; ringkasan bertambah | F-08, F-09 |
| AC-12 | Ubah layanan | Klik "Ubah" pada satu baris → ubah nama & harga → simpan | Data berubah pada tabel dan katalog; ringkasan sesuai | F-08 |
| AC-13 | Batal ubah | Klik "Ubah", ubah field, klik "Batal" | Form kembali ke mode tambah; data lama tidak berubah | F-08 |
| AC-14 | Hapus layanan | Klik "Hapus" → konfirmasi | Baris hilang dari tabel dan katalog; ringkasan berkurang | F-08, F-09 |
| AC-15 | Batal hapus | Klik "Hapus" → "Batal" pada dialog | Data tetap ada, tidak ada perubahan | F-08 |
| AC-16 | Ringkasan dashboard | Bandingkan kartu ringkasan dengan isi tabel | Total layanan = jumlah baris; total stok = jumlah kolom stok; stok habis & kategori benar | F-09 |
| AC-17 | Persistensi refresh | Setelah menambah 1 layanan, refresh halaman | Layanan tetap ada di katalog dan dashboard | F-10 |
| AC-18 | Persistensi hapus | Hapus satu layanan, refresh halaman | Layanan tetap tidak ada (data contoh tidak muncul kembali otomatis) | F-10 |
| AC-19 | Hapus semua | Hapus seluruh layanan, refresh | Katalog menampilkan keadaan kosong; dashboard total 0; tidak ada data contoh yang kembali | F-10, F-11 |
| AC-20 | Muat ulang data contoh | Klik "Muat ulang data contoh" → konfirmasi | 8 data contoh kembali dan ringkasan diperbarui | F-10 |
| AC-21 | Harga negatif | Tambah layanan dengan harga `-1` | Form menolak dengan pesan kesalahan; data tidak tersimpan | Validasi |
| AC-22 | Stok negatif | Tambah layanan dengan stok `-1` | Form menolak dengan pesan kesalahan; data tidak tersimpan | Validasi |
| AC-23 | Stok desimal | Isi stok `2,5` / `2.5` | Form menolak karena stok harus bilangan bulat | Validasi |
| AC-24 | Field wajib | Kosongkan nama atau deskripsi lalu simpan | Form menolak dan menampilkan pesan yang jelas | Validasi |
| AC-25 | Teks berbahaya | Simpan nama `<b>Uji</b>` | Teks tampil apa adanya, tidak menjadi HTML tebal | NF-10 |
| AC-26 | Gambar gagal muat | Isi URL gambar dengan `/images/tidak-ada.svg` | Muncul placeholder lokal, layout tidak rusak | F-02 |
| AC-27 | Responsif | Perkecil jendela hingga ±375 px | Tidak ada scroll horizontal; tombol dan form tetap dapat digunakan | NF-07 |
| AC-28 | Tanpa API key | Cari `apiKey`/`token`/`secret` di kode; periksa localStorage | Tidak ditemukan kredensial apa pun | NF-03, NF-04 |
| AC-29 | Build produksi | Jalankan `npm run build` | Perintah selesai tanpa error; folder `dist/` terbentuk | NF-02 |

**Bukti pengujian:** isi tabel berikut saat iterasi 7.

| Tanggal | Penguji | AC lulus | AC gagal | Catatan |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

---

## 10. Implementation Plan per Iterasi

Setiap iterasi berakhir dengan aplikasi yang dapat dijalankan dan diperiksa.

### Iterasi 1 — Fondasi Vite & tampilan katalog
- Inisialisasi proyek Vite (JavaScript vanilla), struktur folder, dan skrip `dev`/`build`.
- Membuat shell halaman: header, brand, tab Katalog/Dashboard, hero, footer.
- Membuat grid kartu katalog dan styling dasar (warna, tipografi, layout responsif).
- Dashboard masih tampilan kosong/placeholder.
- **Selesai bila:** `npm run dev` berjalan, halaman katalog tampil tanpa error konsol.

### Iterasi 2 — Data contoh & placeholder lokal
- Menambahkan 5 kategori baku dan 8 data contoh pada modul data.
- Membuat 8 gambar SVG lokal + `placeholder.svg`.
- Merender kartu lengkap: gambar, nama, kategori, harga Rupiah, stok, deskripsi, label unggulan.
- Fallback gambar gagal muat → placeholder.
- **Selesai bila:** AC-01, AC-09, AC-26 lulus.

### Iterasi 3 — Pencarian, filter, sorting
- Implementasi pencarian real-time, filter kategori, dan 5 opsi sorting dengan aturan Bagian 3.2.
- Menampilkan jumlah hasil dan keadaan kosong + tombol bersihkan.
- **Selesai bila:** AC-02 s.d. AC-08 lulus.

### Iterasi 4 — Tombol pesan WhatsApp
- Membuat util format pesan dan tautan `wa.me` dengan nomor contoh fiktif.
- Menonaktifkan pemesanan saat stok 0.
- Menambahkan catatan demo pada footer.
- **Selesai bila:** AC-10 lulus dan tidak ada kredensial tersimpan.

### Iterasi 5 — Dashboard CRUD
- Membuat form tambah/ubah dengan field sesuai model data, validasi, dan pesan kesalahan.
- Membuat tabel layanan dengan aksi Ubah/Hapus.
- Menambahkan dialog konfirmasi hapus dan toast umpan balik.
- **Selesai bila:** AC-11 s.d. AC-15, AC-21 s.d. AC-25 lulus.

### Iterasi 6 — localStorage & ringkasan dashboard
- Menambahkan modul penyimpanan: muat, simpan, reset, pembuat id, penanganan data rusak.
- Membuat 4 kartu ringkasan (total layanan, total stok, stok habis, kategori).
- Menambahkan tombol "Muat ulang data contoh" dengan konfirmasi.
- **Selesai bila:** AC-16 s.d. AC-20 lulus.

### Iterasi 7 — Pengujian & penyempurnaan
- Menjalankan seluruh AC-01 s.d. AC-29 di Chrome/Edge (dan satu peramban lain bila tersedia).
- Mengisi tabel bukti pengujian.
- Memperbaiki cacat yang ditemukan tanpa menambah fitur di luar ruang lingkup.
- Menjalankan `npm run build` dan memeriksa hasil `preview`.
- **Selesai bila:** semua AC lulus atau setiap kegagalan tercatat dengan alasan yang disetujui.

---

## 11. Batasan Pengerjaan

- Jangan menyimpan API key, token, atau rahasia apa pun di kode, aset, maupun localStorage.
- Jangan menjalankan perintah berbahaya atau merusak (mis. menghapus data di luar folder proyek).
- Gunakan hanya data contoh nonpribadi; nomor WhatsApp harus fiktif.
- Aplikasi hanya untuk latihan/demo; jangan mengklaimnya sebagai sistem toko produksi.
- Tidak menambah fitur di luar Bagian 3 dan 4 tanpa memperbarui dokumen ini lebih dulu.
