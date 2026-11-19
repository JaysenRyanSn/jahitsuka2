# UI-SPEC.md — JahitSuka

Versi: 1.0  
Sumber: SPEC.md JahitSuka 
Jenis aplikasi: Katalog bisnis jahit berbasis web  
Tech stack: Vite, JavaScript vanilla, HTML, CSS, localStorage

## 1. Tujuan Desain

Membuat tampilan katalog layanan jahit yang mudah digunakan calon pelanggan dan pengelola toko. Tampilan harus terasa hangat, rapi, mudah dibaca, dan tetap nyaman digunakan pada layar ponsel.

Prinsip desain:
- Mobile-first dan responsif.
- Navigasi sederhana antara Katalog dan Dashboard.
- Informasi nama, kategori, harga, stok, dan deskripsi mudah ditemukan.
- Tombol utama memiliki label yang jelas.
- Gunakan komponen dan pola tampilan yang konsisten.
- Tidak menampilkan halaman login karena aplikasi tidak memiliki autentikasi.

## 2. Identitas Visual

### 2.1 Warna

| Peran | Warna | Penggunaan |
|---|---|---|
| Primary | Hijau rempah `#355E3B` | Navbar, tombol utama, elemen aktif |
| Primary hover | Hijau gelap `#284A2E` | Hover tombol utama |
| Background | Krem hangat `#F8F4E9` | Latar utama |
| Surface | Putih gading `#FFFDF7` | Kartu, panel, form |
| Text utama | `#263128` | Judul dan isi |
| Text sekunder | `#667064` | Deskripsi dan metadata |
| Border | `#E5E0D4` | Garis pemisah dan batas kartu |
| Accent | `#C58B45` | Label unggulan atau aksen |
| Danger | `#B42318` | Hapus, stok habis, validasi error |
| Success | `#287A48` | Notifikasi berhasil |

Pastikan teks memiliki kontras yang cukup terhadap latar. Jangan menggunakan warna sebagai satu-satunya penanda status.

### 2.2 Tipografi

- Gunakan font sans-serif.
- Utamakan font sistem agar aplikasi tidak bergantung pada layanan eksternal.
- Judul halaman lebih tebal daripada teks isi.
- Harga dibuat mudah terlihat.
- Deskripsi menggunakan ukuran yang nyaman dibaca.

Skala yang disarankan:
- H1: 28–36 px desktop, 24–28 px mobile.
- H2: 20–24 px.
- Nama kartu: 16–18 px.
- Teks isi: 14–16 px.
- Label dan metadata: minimal 12–14 px.

### 2.3 Bentuk dan Spasi

- Gunakan radius kartu dan tombol sekitar 10–14 px.
- Gunakan jarak antarkomponen yang konsisten.
- Hindari bayangan yang terlalu tebal.
- Area klik tombol minimal nyaman disentuh pada layar ponsel.
- Gunakan ikon hanya jika membantu pemahaman. Ikon penting tetap disertai teks.

## 3. Struktur Navigasi

Navbar berisi:
- Brand teks atau logo sederhana “RasaNusa”.
- Tab “Katalog”.
- Tab “Dashboard”.
- Penanda tab aktif.

Perilaku:
- Katalog menjadi halaman awal.
- Tab berpindah tampilan tanpa memerlukan backend.
- Dashboard diberi keterangan “Area pengelola · demo”.
- Jangan membuat form login atau klaim bahwa Dashboard terlindungi.

## 4. Spesifikasi Halaman Katalog

Urutan elemen:
1. Navbar.
2. Hero.
3. Area pencarian, filter, dan sorting.
4. Informasi jumlah hasil.
5. Grid kartu layanan.
6. Keadaan kosong bila tidak ada hasil.
7. Footer dengan keterangan bahwa aplikasi merupakan demo.

### 4.1 Hero

Konten:
- Judul: “Temukan Layanan Jahit Pilihan Anda”.
- Deskripsi singkat tentang layanan jahit RasaNusa.
- Tombol atau tautan “Lihat Katalog” yang mengarahkan fokus/scroll ke daftar layanan.

Tampilan:
- Latar krem atau panel hijau rempah.
- Judul jelas dan tidak terlalu panjang.
- Pada mobile, konten ditumpuk secara vertikal.

### 4.2 Pencarian, Filter, dan Sorting

Komponen:
- Input pencarian dengan placeholder “Cari layanan jahit...”.
- Filter kategori dengan opsi “Semua kategori”, Wanita, Pria, Seragam, Permak, dan Aksesori.
- Sorting dengan opsi:
  - Unggulan dulu (default).
  - Harga terendah.
  - Harga tertinggi.
  - Nama A–Z.
  - Stok terbanyak.

Perilaku:
- Pencarian berjalan saat pengguna mengetik.
- Pencarian, filter, dan sorting dapat digunakan bersamaan.
- Jumlah hasil diperbarui sesuai hasil yang terlihat.
- Tombol “Bersihkan pencarian” muncul pada keadaan kosong dan mengembalikan pencarian serta filter ke nilai awal.

Layout:
- Desktop: kontrol dapat disusun dalam satu baris atau dua baris.
- Mobile: kontrol ditumpuk vertikal dengan lebar penuh.

### 4.3 Kartu Layanan

Setiap kartu menampilkan:
- Foto layanan atau placeholder lokal.
- Label “Unggulan” bila `unggulan` bernilai true.
- Nama layanan.
- Kategori.
- Harga dalam format Rupiah.
- Stok atau status “Stok habis”.
- Deskripsi.
- Tombol “Pesan via WhatsApp” jika stok lebih dari 0.
- Tombol nonaktif “Stok habis” jika stok 0.

Perilaku:
- Gambar yang gagal dimuat diganti dengan `placeholder.svg`.
- Gambar memiliki teks alternatif yang sesuai.
- Harga dan stok harus terlihat tanpa membuka detail tambahan.
- Tombol WhatsApp membuka tautan `wa.me` di tab baru.
- Pesan WhatsApp berisi nama dan harga layanan.
- Tautan eksternal menggunakan `rel="noopener noreferrer"`.

Layout:
- Desktop lebar: 3 atau 4 kolom sesuai ruang.
- Tablet: 2 kolom.
- Mobile: 1 kolom pada layar sempit, 2 kolom hanya jika konten tetap terbaca.

## 5. Spesifikasi Dashboard

Dashboard adalah area demo pada perangkat yang sama. Tidak ada autentikasi.

Urutan elemen:
1. Judul “Dashboard Pengelola”.
2. Keterangan “Area pengelola · demo”.
3. Empat kartu ringkasan.
4. Tombol “Muat ulang data contoh”.
5. Form tambah atau ubah layanan.
6. Tabel daftar layanan.

### 5.1 Kartu Ringkasan

Tampilkan empat metrik:
- Total layanan.
- Total stok.
- Jumlah layanan dengan stok habis.
- Jumlah kategori yang digunakan.

Angka harus dihitung dari data saat ini dan berubah setelah CRUD.

### 5.2 Form Tambah dan Ubah

Field:
- Nama layanan.
- Kategori.
- Harga.
- Stok.
- Deskripsi.
- URL gambar (opsional).
- Checkbox “Jadikan unggulan”.

Perilaku:
- Mode tambah memakai form kosong dan tombol “Simpan layanan”.
- Mode ubah mengisi form dengan data terpilih.
- Mode ubah menampilkan tombol “Simpan perubahan” dan “Batal”.
- Tampilkan pesan validasi dekat field terkait.
- Setelah berhasil, tampilkan toast singkat.
- Jangan mengosongkan form jika validasi gagal.

Validasi yang harus didukung:
- Nama 3–70 karakter.
- Deskripsi 5–240 karakter.
- Harga angka valid dan minimal 0.
- Stok bilangan bulat dan minimal 0.
- Kategori harus berasal dari daftar kategori baku.
- URL gambar, jika diisi, harus diawali `http://`, `https://`, atau `/`.

### 5.3 Tabel Layanan

Kolom:
- Nama layanan.
- Kategori.
- Harga.
- Stok.
- Status unggulan.
- Aksi.

Aksi:
- “Ubah” membuka form dalam mode ubah.
- “Hapus” menampilkan dialog konfirmasi berisi nama layanan.
- Data hanya dihapus setelah pengguna mengonfirmasi.

Pada layar kecil, tabel boleh menggunakan area gulir horizontal yang terkontrol atau tampilan baris berbentuk kartu. Jangan sampai seluruh halaman mengalami scroll horizontal.

### 5.4 Muat Ulang Data Contoh

- Tombol “Muat ulang data contoh” tersedia di Dashboard.
- Klik tombol menampilkan konfirmasi.
- Jika dikonfirmasi, delapan data contoh dimuat kembali.
- Jika dibatalkan, data tidak berubah.

## 6. Keadaan UI dan Umpan Balik

Rancang keadaan berikut:
- Katalog normal.
- Hasil pencarian kosong.
- Daftar layanan benar-benar kosong.
- Gambar gagal dimuat.
- Stok habis.
- Form valid.
- Form memiliki kesalahan validasi.
- Toast berhasil.
- Dialog konfirmasi hapus.
- Dialog konfirmasi muat ulang data contoh.
- Kesalahan penyimpanan localStorage.

Gunakan teks yang langsung menjelaskan keadaan dan tindakan berikutnya.

## 7. Responsivitas

Target lebar:
- Mobile mulai dari 360 px.
- Tablet.
- Desktop.

Aturan:
- Tidak ada scroll horizontal pada halaman utama.
- Navbar tetap mudah digunakan pada layar kecil.
- Kontrol pencarian, filter, dan sorting menggunakan lebar yang sesuai.
- Grid kartu menyesuaikan lebar layar.
- Form dashboard tersusun satu kolom pada mobile.
- Tabel dashboard tidak merusak lebar halaman.
- Tombol dan input tetap mudah disentuh.

## 8. Aksesibilitas

- Gunakan elemen HTML semantik.
- Setiap input memiliki label.
- Gambar memiliki `alt` yang sesuai.
- Semua fungsi dapat diakses menggunakan keyboard.
- Fokus keyboard terlihat jelas.
- Tombol memiliki nama yang menjelaskan fungsinya.
- Pesan validasi dapat dikenali dan dikaitkan dengan field.
- Perubahan jumlah hasil dan notifikasi dapat diumumkan melalui `aria-live` bila sesuai.
- Jangan mengandalkan warna saja untuk membedakan status.

## 9. Wireframe Teks

### 9.1 Katalog Desktop

```text
+------------------------------------------------------------------+
| RasaNusa                         Katalog             Dashboard   |
+------------------------------------------------------------------+
|                                                                  |
|             Temukan Layanan Jahit Pilihan Anda                   |
|             Deskripsi singkat RasaNusa                           |
|                         [Lihat Katalog]                           |
|                                                                  |
+------------------------------------------------------------------+
| [ Cari layanan jahit...       ] [Kategori v] [Urutkan v]         |
| Menampilkan 8 layanan                                            |
+------------------------------------------------------------------+
| [Foto]             [Foto]              [Foto]                    |
| Kebaya Modern      Batik Pria          Dress Lurik               |
| Wanita             Pria                Wanita                    |
| Rp450.000          Rp275.000           Rp320.000                 |
| Stok: 6            Stok: 12             Stok: 5                   |
| [Pesan WhatsApp]   [Pesan WhatsApp]    [Pesan WhatsApp]          |
+------------------------------------------------------------------+
|                         Footer Demo                              |
+------------------------------------------------------------------+
```

### 9.2 Katalog Mobile

```text
+------------------------------+
| RasaNusa          [Menu/Tab]  |
+------------------------------+
| Temukan Layanan Jahit        |
| Pilihan Anda                 |
| Deskripsi singkat            |
| [Lihat Katalog]              |
+------------------------------+
| [Cari layanan jahit...]      |
| [Semua kategori          v]  |
| [Urutkan                v]   |
| Menampilkan 8 layanan        |
+------------------------------+
| [          Foto           ]  |
| Kebaya Modern Bordir         |
| Wanita                       |
| Rp450.000                    |
| Stok: 6                      |
| [Pesan via WhatsApp]         |
+------------------------------+
| [          Foto           ]  |
| Batik Pria Lengan Panjang    |
| Pria                         |
| Rp275.000                    |
| Stok: 12                     |
| [Pesan via WhatsApp]         |
+------------------------------+
| Footer Demo                  |
+------------------------------+
```

### 9.3 Dashboard Desktop

```text
+------------------------------------------------------------------+
| RasaNusa                         Katalog             Dashboard   |
+------------------------------------------------------------------+
| Dashboard Pengelola                         Area pengelola · demo|
|                                                                  |
| [Total Layanan] [Total Stok] [Stok Habis] [Jumlah Kategori]      |
|                                                                  |
| [Muat ulang data contoh]                                         |
+------------------------------------------------------------------+
| Form Layanan                         | Daftar Layanan             |
| Nama layanan: [................]    | Nama | Kategori | Harga   |
| Kategori:     [.............. v]    | ...  | ...      | ...     |
| Harga:        [................]    |      |          |         |
| Stok:         [................]    |      |          |         |
| Deskripsi:    [................]    |      |          |         |
| URL gambar:   [................]    |      |          |         |
| [ ] Unggulan                         |      | [Ubah] [Hapus]       |
| [Simpan layanan]                    |                            |
+------------------------------------------------------------------+
```

### 9.4 Dashboard Mobile

```text
+------------------------------+
| RasaNusa          Dashboard  |
+------------------------------+
| Dashboard Pengelola          |
| Area pengelola · demo        |
+------------------------------+
| [Total Layanan] [Total Stok] |
| [Stok Habis]    [Kategori]   |
+------------------------------+
| [Muat ulang data contoh]     |
+------------------------------+
| Form Layanan                 |
| Nama layanan                 |
| [........................]   |
| Kategori                     |
| [....................... v]  |
| Harga                        |
| [........................]   |
| Stok                         |
| [........................]   |
| Deskripsi                    |
| [........................]   |
| URL gambar                   |
| [........................]   |
| [ ] Unggulan                 |
| [Simpan layanan]             |
+------------------------------+
| Daftar Layanan               |
| Nama, kategori, harga, stok  |
| [Ubah] [Hapus]               |
+------------------------------+
```

## 10. Batasan Desain

- Jangan menambahkan login atau registrasi.
- Jangan menambahkan pembayaran, keranjang, checkout, atau pelacakan pesanan.
- Jangan menggunakan WhatsApp API. Gunakan tautan `wa.me`.
- Jangan menambahkan upload file gambar. Gunakan path lokal atau URL gambar sesuai SPEC.md.
- Jangan menambahkan backend atau database.
- Jangan mengubah ruang lingkup fitur MVP tanpa memperbarui SPEC.md.
