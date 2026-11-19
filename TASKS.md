# TASKS.md — JahitSuka

Versi: 1.0  
Acuan: SPEC.md dan UI-SPEC.md  
Tujuan: Daftar pekerjaan implementasi MVP katalog bisnis jahit dalam latihan satu hari.

## Aturan Pengerjaan

- Gunakan Vite, JavaScript vanilla, HTML, CSS, dan localStorage.
- Jangan gunakan framework frontend atau backend.
- Jangan membuat login atau autentikasi.
- Kerjakan sesuai urutan milestone.
- Selesaikan acceptance criteria setiap tugas sebelum lanjut.
- Jangan menambah fitur di luar SPEC.md.
- Gunakan data contoh nonpribadi dan nomor WhatsApp fiktif.
- Jangan menyimpan API key, token, atau rahasia.
- Jangan menjalankan perintah yang menghapus data di luar folder proyek.

## Struktur Berkas Target

```text
rasanusa/
├── index.html
├── package.json
├── public/
│   └── images/
│       ├── kebaya-modern.svg
│       ├── batik-pria.svg
│       ├── dress-lurik.svg
│       ├── kemeja-tenun.svg
│       ├── seragam-sekolah.svg
│       ├── permak-celana.svg
│       ├── rok-songket.svg
│       ├── tas-kanvas.svg
│       └── placeholder.svg
└── src/
    ├── main.js
    ├── data.js
    ├── store.js
    ├── utils.js
    └── style.css
```

Catatan: Nama berkas gambar boleh disesuaikan, tetapi semua gambar harus tersedia secara lokal dan memiliki fallback `placeholder.svg`.

---

## Milestone 1 — Scaffold Proyek dan Kerangka UI

### Tugas 1.1 — Inisialisasi Vite

Pekerjaan:
- Buat proyek Vite dengan template JavaScript vanilla.
- Pastikan skrip `dev` dan `build` tersedia.
- Siapkan struktur folder sesuai struktur target.

Acceptance criteria:
- `npm install` selesai tanpa error.
- `npm run dev` menjalankan aplikasi.
- `npm run build` dapat dijalankan setelah struktur dasar dibuat.

Berkas yang mungkin berubah:
- `package.json`
- `index.html`
- `src/main.js`
- `src/style.css`

### Tugas 1.2 — Buat kerangka halaman

Pekerjaan:
- Buat navbar dengan brand RasaNusa.
- Buat navigasi tab Katalog dan Dashboard.
- Buat hero dan footer.
- Siapkan area konten katalog dan dashboard.
- Jadikan Katalog sebagai tampilan awal.

Acceptance criteria:
- Brand dan dua tab navigasi terlihat.
- Tab aktif memiliki penanda visual.
- Katalog menjadi tampilan awal.
- Tidak ada halaman login.
- Dashboard memiliki label “Area pengelola · demo”.

Berkas yang mungkin berubah:
- `index.html`
- `src/main.js`
- `src/style.css`

---

## Milestone 2 — Data Contoh dan Kartu Katalog

### Tugas 2.1 — Siapkan data dan kategori

Pekerjaan:
- Buat lima kategori: Wanita, Pria, Seragam, Permak, Aksesori.
- Buat delapan data contoh sesuai SPEC.md.
- Gunakan model data: `id`, `nama`, `kategori`, `harga`, `stok`, `deskripsi`, `imageUrl`, `unggulan`.

Delapan data contoh:
1. Kebaya Modern Bordir, Wanita, Rp450.000, stok 6, unggulan.
2. Batik Pria Lengan Panjang, Pria, Rp275.000, stok 12, unggulan.
3. Dress Lurik Harian, Wanita, Rp320.000, stok 5.
4. Kemeja Tenun Klasik, Pria, Rp290.000, stok 8.
5. Seragam Sekolah (Set), Seragam, Rp185.000, stok 20, unggulan.
6. Permak & Veting Celana, Permak, Rp65.000, stok 30.
7. Rok Songket Pesta, Wanita, Rp510.000, stok 4, unggulan.
8. Tas Kanvas Bordir, Aksesori, Rp150.000, stok 9.

Acceptance criteria:
- Terdapat delapan data contoh.
- Semua data mengikuti model yang ditentukan.
- Harga berupa angka dan stok berupa bilangan bulat.
- Kategori hanya menggunakan lima kategori baku.
- Empat layanan unggulan ditandai sesuai data contoh.

Berkas yang mungkin berubah:
- `src/data.js`

### Tugas 2.2 — Siapkan gambar lokal

Pekerjaan:
- Buat delapan aset gambar SVG lokal.
- Buat `placeholder.svg`.
- Hubungkan setiap data dengan gambar lokal.
- Tambahkan fallback jika gambar gagal dimuat.

Acceptance criteria:
- Semua kartu memiliki gambar atau placeholder.
- Gambar gagal muat diganti placeholder lokal.
- Kegagalan gambar tidak merusak layout.
- Setiap gambar memiliki teks alternatif.

Berkas yang mungkin berubah:
- `public/images/*`
- `src/data.js`
- `src/main.js`
- `src/style.css`

### Tugas 2.3 — Render kartu katalog

Pekerjaan:
- Tampilkan nama, kategori, harga Rupiah, stok, dan deskripsi.
- Tampilkan label Unggulan bila sesuai.
- Buat grid responsif sesuai UI-SPEC.md.

Acceptance criteria:
- Delapan kartu tampil saat aplikasi pertama kali dibuka.
- Harga menggunakan format Rupiah `id-ID`.
- Stok 0 menampilkan status “Stok habis”.
- Tampilan kartu menyesuaikan lebar layar.

Berkas yang mungkin berubah:
- `src/main.js`
- `src/utils.js`
- `src/style.css`

---

## Milestone 3 — Pencarian, Filter, Sorting, dan Keadaan Kosong

### Tugas 3.1 — Pencarian real-time

Pekerjaan:
- Buat input pencarian.
- Cari substring pada nama, kategori, dan deskripsi.
- Pencarian tidak peka huruf besar/kecil.

Acceptance criteria:
- Pencarian berjalan saat pengguna mengetik.
- Kata kunci `kebaya` menemukan layanan yang sesuai.
- Kata kunci tanpa hasil menampilkan keadaan kosong.
- Jumlah hasil ikut diperbarui.

Berkas yang mungkin berubah:
- `index.html`
- `src/main.js`
- `src/style.css`

### Tugas 3.2 — Filter kategori

Pekerjaan:
- Buat pilihan “Semua kategori” dan lima kategori baku.
- Terapkan filter bersama pencarian.

Acceptance criteria:
- Memilih Wanita hanya menampilkan layanan kategori Wanita.
- Pencarian dan filter kategori bekerja bersamaan.
- Mengembalikan filter ke “Semua kategori” menampilkan seluruh hasil yang sesuai pencarian.

Berkas yang mungkin berubah:
- `index.html`
- `src/main.js`

### Tugas 3.3 — Sorting

Pekerjaan:
- Tambahkan lima opsi sorting.
- Terapkan sorting setelah pencarian dan filter.
- Gunakan nama A–Z sebagai aturan urutan kedua sesuai SPEC.md.

Acceptance criteria:
- Default: unggulan lebih dahulu, lalu nama A–Z.
- Harga terendah mengurutkan harga menaik.
- Harga tertinggi mengurutkan harga menurun.
- Nama A–Z menggunakan locale Indonesia.
- Stok terbanyak mengurutkan stok menurun.
- Sorting tidak mengubah data tersimpan atau urutan dashboard.

Berkas yang mungkin berubah:
- `index.html`
- `src/main.js`

### Tugas 3.4 — Keadaan kosong dan reset pencarian

Pekerjaan:
- Buat pesan saat hasil pencarian kosong.
- Buat tombol “Bersihkan pencarian”.
- Tangani kondisi daftar layanan benar-benar kosong.

Acceptance criteria:
- Pencarian `zzz` menampilkan pesan keadaan kosong.
- Tombol bersihkan mengembalikan input pencarian dan filter ke default.
- Jika semua layanan dihapus, tampilkan keadaan katalog kosong.
- Data contoh tidak muncul kembali otomatis setelah daftar kosong.

Berkas yang mungkin berubah:
- `src/main.js`
- `src/style.css`

---

## Milestone 4 — Pemesanan melalui WhatsApp

### Tugas 4.1 — Buat tautan WhatsApp

Pekerjaan:
- Buat pesan dengan format: “Halo RasaNusa, saya ingin memesan <nama> (<harga Rupiah>). Apakah masih tersedia?”
- Encode pesan untuk URL.
- Gunakan nomor contoh fiktif.
- Buka tautan di tab baru dengan `noopener noreferrer`.

Acceptance criteria:
- Tombol “Pesan via WhatsApp” tersedia pada layanan yang stoknya lebih dari 0.
- Pesan berisi nama dan harga layanan.
- Tautan mengarah ke `wa.me`.
- Tidak ada WhatsApp API atau pengiriman otomatis.
- Jika stok 0, tombol diganti menjadi nonaktif “Stok habis”.

Berkas yang mungkin berubah:
- `src/utils.js`
- `src/main.js`
- `src/style.css`

---

## Milestone 5 — Dashboard dan CRUD

### Tugas 5.1 — Buat layout dashboard

Pekerjaan:
- Buat judul Dashboard Pengelola.
- Tambahkan label “Area pengelola · demo”.
- Siapkan area form dan tabel layanan.

Acceptance criteria:
- Dashboard dapat dibuka melalui tab navigasi.
- Tidak ada autentikasi atau login.
- Layout dashboard responsif.

Berkas yang mungkin berubah:
- `index.html`
- `src/main.js`
- `src/style.css`

### Tugas 5.2 — Buat form tambah layanan

Pekerjaan:
- Tambahkan field nama, kategori, harga, stok, deskripsi, URL gambar opsional, dan checkbox unggulan.
- Terapkan validasi sesuai SPEC.md.

Acceptance criteria:
- Nama wajib 3–70 karakter.
- Deskripsi wajib 5–240 karakter.
- Harga harus angka valid dan minimal 0.
- Stok harus bilangan bulat dan minimal 0.
- Kategori harus salah satu dari lima kategori baku.
- URL gambar yang diisi harus diawali `http://`, `https://`, atau `/`.
- Form menampilkan pesan validasi yang jelas.
- Data valid dapat disimpan dan muncul di katalog serta tabel.

Berkas yang mungkin berubah:
- `index.html`
- `src/main.js`
- `src/utils.js`
- `src/style.css`

### Tugas 5.3 — Buat fitur ubah layanan

Pekerjaan:
- Tambahkan tombol “Ubah” pada setiap baris.
- Isi form dengan data layanan yang dipilih.
- Sediakan tombol “Simpan perubahan” dan “Batal”.

Acceptance criteria:
- Tombol Ubah mengisi form dengan data yang benar.
- Data dapat diperbarui setelah validasi lulus.
- Perubahan terlihat pada katalog, tabel, dan ringkasan.
- Tombol Batal keluar dari mode ubah tanpa mengubah data.

Berkas yang mungkin berubah:
- `src/main.js`
- `src/style.css`

### Tugas 5.4 — Buat fitur hapus layanan

Pekerjaan:
- Tambahkan tombol “Hapus” pada setiap baris.
- Tampilkan dialog konfirmasi dengan nama layanan.
- Hapus data hanya setelah konfirmasi.

Acceptance criteria:
- Konfirmasi menampilkan nama layanan yang akan dihapus.
- Memilih konfirmasi menghapus data dari tabel dan katalog.
- Memilih batal mempertahankan data.
- Ringkasan dashboard ikut diperbarui.

Berkas yang mungkin berubah:
- `src/main.js`

### Tugas 5.5 — Tambahkan notifikasi

Pekerjaan:
- Tampilkan toast setelah tambah, ubah, dan hapus berhasil.
- Tampilkan pesan jika penyimpanan gagal.

Acceptance criteria:
- Setiap aksi CRUD yang berhasil memberi umpan balik.
- Aplikasi tidak menyatakan berhasil jika penyimpanan gagal.
- Pesan dapat dibaca dan tidak menutupi kontrol penting.

Berkas yang mungkin berubah:
- `src/main.js`
- `src/style.css`

---

## Milestone 6 — localStorage dan Ringkasan Dashboard

### Tugas 6.1 — Buat modul penyimpanan

Pekerjaan:
- Gunakan key `rasanusa.products.v1`.
- Buat fungsi load, save, reset, dan pembuat ID.
- Tangani JSON rusak dan error localStorage.
- Bedakan data kosong `[]` dengan data yang belum pernah disimpan.

Acceptance criteria:
- Perubahan CRUD bertahan setelah refresh.
- Jika key belum tersedia, aplikasi memuat delapan data contoh.
- Jika data tersimpan berupa array kosong, aplikasi tetap menampilkan katalog kosong.
- Jika data rusak atau bukan array, aplikasi menggunakan data contoh.
- Error penyimpanan ditangani dan diberi pesan.

Berkas yang mungkin berubah:
- `src/store.js`
- `src/data.js`
- `src/main.js`

### Tugas 6.2 — Buat ringkasan dashboard

Pekerjaan:
- Buat empat kartu ringkasan: total layanan, total stok, jumlah stok habis, jumlah kategori.
- Hitung ulang setelah setiap perubahan data.

Acceptance criteria:
- Total layanan sama dengan jumlah data.
- Total stok sama dengan penjumlahan seluruh stok.
- Jumlah stok habis sesuai jumlah layanan dengan stok 0.
- Jumlah kategori sesuai kategori unik yang digunakan.
- Semua angka berubah setelah CRUD.

Berkas yang mungkin berubah:
- `src/main.js`
- `src/style.css`

### Tugas 6.3 — Buat reset data contoh

Pekerjaan:
- Tambahkan tombol “Muat ulang data contoh”.
- Tampilkan konfirmasi sebelum reset.
- Muat kembali delapan data awal setelah disetujui.

Acceptance criteria:
- Konfirmasi ditampilkan sebelum reset.
- Jika dibatalkan, data tidak berubah.
- Jika disetujui, delapan data contoh kembali.
- Katalog, tabel, dan ringkasan diperbarui.

Berkas yang mungkin berubah:
- `src/main.js`
- `src/store.js`

---

## Milestone 7 — Validasi, Keamanan, dan Aksesibilitas

### Tugas 7.1 — Validasi data

Pekerjaan:
- Pastikan semua field mengikuti aturan SPEC.md.
- Tolak harga negatif, stok negatif, dan stok desimal.
- Tampilkan pesan kesalahan yang mudah dipahami.

Acceptance criteria:
- Harga `-1` ditolak.
- Stok `-1` ditolak.
- Stok `2,5` atau `2.5` ditolak.
- Nama atau deskripsi kosong ditolak.
- Data tidak berubah jika validasi gagal.

Berkas yang mungkin berubah:
- `src/main.js`
- `src/utils.js`

### Tugas 7.2 — Cegah XSS dan validasi URL gambar

Pekerjaan:
- Tampilkan teks pengguna sebagai teks, bukan HTML.
- Hindari penggunaan `innerHTML` untuk data pengguna, atau lakukan escaping dengan benar.
- Validasi awalan URL gambar.

Acceptance criteria:
- Nama `<b>Uji</b>` tampil sebagai teks biasa.
- Input URL gambar dengan skema yang tidak diizinkan ditolak.
- Tidak ada kredensial atau API key di kode maupun localStorage.

Berkas yang mungkin berubah:
- `src/main.js`
- `src/utils.js`

### Tugas 7.3 — Aksesibilitas

Pekerjaan:
- Gunakan label pada input.
- Tambahkan alt pada gambar.
- Pastikan navigasi keyboard dan fokus terlihat.
- Tambahkan `aria-live` untuk notifikasi atau jumlah hasil bila sesuai.

Acceptance criteria:
- Semua input memiliki label.
- Tombol dapat digunakan dengan keyboard.
- Fokus keyboard terlihat.
- Status penting tidak dibedakan hanya dengan warna.

Berkas yang mungkin berubah:
- `index.html`
- `src/main.js`
- `src/style.css`

---

## Milestone 8 — Responsivitas dan Penyempurnaan UI

### Tugas 8.1 — Terapkan desain UI-SPEC

Pekerjaan:
- Terapkan warna krem hangat dan hijau rempah.
- Gunakan font sans-serif.
- Rapikan navbar, hero, kartu, form, tabel, toast, dan dialog.
- Terapkan layout mobile-first.

Acceptance criteria:
- Tampilan konsisten dengan UI-SPEC.md.
- Grid kartu menyesuaikan lebar layar.
- Form dashboard satu kolom pada mobile.
- Tabel tidak menyebabkan scroll horizontal pada seluruh halaman.

Berkas yang mungkin berubah:
- `src/style.css`
- `index.html`

### Tugas 8.2 — Uji ukuran layar

Pekerjaan:
- Periksa tampilan pada lebar 360 px, 375 px, tablet, dan desktop.
- Perbaiki elemen yang bertumpuk atau terpotong.

Acceptance criteria:
- Pada lebar sekitar 375 px tidak ada scroll horizontal halaman.
- Tombol dan input tetap dapat digunakan.
- Konten tetap terbaca pada desktop dan mobile.

Berkas yang mungkin berubah:
- `src/style.css`

---

## Milestone 9 — Pengujian Manual

### Tugas 9.1 — Jalankan acceptance criteria

Pekerjaan:
- Uji seluruh AC-01 sampai AC-29 dari SPEC.md.
- Catat hasil lulus dan gagal.
- Perbaiki masalah yang ditemukan.

Acceptance criteria:
- Seluruh AC-01 sampai AC-29 sudah diperiksa.
- Kegagalan dicatat dengan langkah reproduksi.
- Tidak ada fitur di luar ruang lingkup yang ditambahkan.

Berkas yang mungkin berubah:
- `src/main.js`
- `src/store.js`
- `src/utils.js`
- `src/style.css`
- Dokumen catatan pengujian bila dibuat.

### Tugas 9.2 — Uji alur utama

Pekerjaan:
- Uji alur pelanggan: buka katalog, cari layanan, filter, urutkan, lalu buka WhatsApp.
- Uji alur pengelola: tambah, ubah, hapus, refresh, dan reset data contoh.

Acceptance criteria:
- Alur pelanggan berjalan tanpa error.
- Alur pengelola berjalan tanpa kehilangan data yang seharusnya tersimpan.
- Katalog dan dashboard selalu menampilkan data yang sama.

Berkas yang mungkin berubah:
- Berkas sumber yang terkait dengan temuan pengujian.

---

## Milestone 10 — Build dan Deployment

### Tugas 10.1 — Build produksi

Pekerjaan:
- Jalankan `npm run build`.
- Periksa hasil build pada folder `dist`.
- Jalankan preview build bila tersedia.

Acceptance criteria:
- `npm run build` selesai tanpa error.
- Folder `dist/` terbentuk.
- Tampilan hasil preview sesuai aplikasi saat development.
- Tidak ada API key, token, atau rahasia di hasil build.

Berkas yang mungkin berubah:
- `package.json`
- Konfigurasi Vite jika diperlukan.

### Tugas 10.2 — Siapkan deployment statis

Pekerjaan:
- Siapkan folder `dist` untuk layanan hosting statis.
- Pastikan path aset menggunakan konfigurasi yang sesuai dengan target hosting.
- Jangan menambahkan backend.

Acceptance criteria:
- Aplikasi dapat disajikan sebagai situs statis.
- Aset gambar dan file CSS/JS dapat dimuat.
- Fitur localStorage tetap berjalan pada browser pengguna.

Berkas yang mungkin berubah:
- `vite.config.js` jika diperlukan.
- `package.json` jika diperlukan.

---

## Urutan Prioritas untuk Latihan Satu Hari

1. Milestone 1: Scaffold dan kerangka UI.
2. Milestone 2: Data contoh dan katalog.
3. Milestone 3: Pencarian, filter, dan sorting.
4. Milestone 4: Tautan WhatsApp.
5. Milestone 5: Dashboard CRUD.
6. Milestone 6: localStorage dan ringkasan.
7. Milestone 7: Validasi, keamanan, aksesibilitas.
8. Milestone 8: Responsivitas.
9. Milestone 9: Pengujian manual.
10. Milestone 10: Build dan deployment.

Jika waktu terbatas, prioritaskan fitur MVP dan acceptance criteria yang tercantum pada SPEC.md. Jangan mengurangi validasi data, penanganan localStorage, atau pemeriksaan keamanan dasar.
