# Audit Keamanan JahitSuka (RasaNusa) — OWASP Top 10:2025

| Item | Nilai |
| --- | --- |
| Tanggal audit | 19 November 2026 |
| Cakupan | Aplikasi katalog + dashboard demo (Vite, JavaScript vanilla, localStorage), aset publik, dependency, konfigurasi repo |
| Basis | Kode di `index.html`, `src/`, `public/`, `package.json`, `package-lock.json`, `.gitignore` |
| Status | **Laporan saja — belum ada kode atau dependency yang diubah** |
| Metode | Pembacaan kode, `grep` sink berbahaya, uji perilaku fungsi dengan Node, `npm audit`, pemeriksaan lockfile |

## 1. Ringkasan eksekutif

Tidak ditemukan kerentanan **Kritis** atau **Tinggi**. Tidak ada XSS yang dapat dieksekusi, tidak ada API key/secret di repo maupun hasil build, dan `npm audit` melaporkan **0 kerentanan** pada 67 paket dev.

Temuan yang perlu ditindaklanjuti bersifat pengerasan (hardening):

| Tingkat | Jumlah | ID |
| --- | --- | --- |
| Kritis | 0 | — |
| Tinggi | 0 | — |
| Sedang | 0 | — |
| Rendah | 3 | SA-01, SA-02, SA-03 |
| Informasional / diterima | 5 | SA-04 … SA-08 |

Tiga temuan rendah semuanya **terbukti** lewat eksekusi, bukan dugaan:

1. **SA-01** — Validasi URL gambar menerima URL protocol-relative (`//host/...`) dan `http://` tanpa host.
2. **SA-02** — Tidak ada batas panjang `imageUrl` dan tidak ada batas ukuran berkas impor; berkas dibaca utuh ke memori.
3. **SA-03** — `validasiForm` mengubah nilai `unggulan` dengan `Boolean()`, sehingga string `"false"` menjadi `true` (belum dapat dicapai lewat UI saat ini).

## 2. Status temuan: terbukti vs dugaan

- **Terbukti**: SA-01, SA-02, SA-03, SA-05, SA-08. Masing-masing disertai bukti keluaran perintah atau kutipan kode dengan nomor baris.
- **Terbukti absen** (bukan dugaan): SA-04 (tidak ada header/meta CSP, tidak ada `Referrer-Policy`), SA-06 (tidak ada CI, tidak ada SBOM), SA-07 (nomor WhatsApp ada di bundle).
- **Dugaan / belum dapat diuji**: dampak nyata CSP dan perilaku peramban atas `//host` tidak diuji end-to-end karena proyek belum punya uji browser. Semua klaim di laporan ini dibatasi pada kode dan uji Node yang benar-benar dijalankan. Tidak ada temuan dugaan yang saya naikkan menjadi temuan terbukti.

## 3. Temuan

### SA-01 — URL gambar menerima protocol-relative dan host kosong

| | |
| --- | --- |
| Tingkat | **Rendah** |
| Status | Terbukti |
| OWASP | A05:2025 Injection (validasi masukan), A02:2025 Security Misconfiguration |
| Lokasi | `src/validate.js:23–27` (regex), dipakai di `src/validate.js:77` dan `:160`; dirender di `src/ui.js:87` |

**Bukti kode** (`src/validate.js:23–27`):

```js
export function urlGambarValid(nilai) {
  if (typeof nilai !== 'string') return false;
  if (nilai === '') return true;
  return /^(https?:\/\/|\/)/.test(nilai);
}
```

**Bukti eksekusi**:

```
//evil.example/x.png  -> true
http:// (tanpa host) -> true
data:image/svg+xml   -> false
javascript:alert(1)  -> false
```

**Risiko.** `javascript:` dan `data:` sudah ditolak, jadi tidak ada eksekusi skrip lewat `img.src`. Namun `//evil.example/x.png` lolos sebagai "path lokal" padahal di peramban menjadi `https://evil.example/x.png`. Akibatnya produk dapat memuat gambar dari host mana pun yang tidak dimaksudkan (pelacakan IP/Referer pengunjung), dan `http://` tanpa host adalah URL tidak valid yang tidak berguna. Pada situs HTTPS, `http://host/gambar` juga memicu mixed content (gambar diblokir, bukan eskalasi).

**Rekomendasi.** Validasi dengan `URL`, tolak `//`, wajibkan host untuk skema http/https, dan batasi panjang (lihat SA-02). Contoh patch minimal:

```js
const MAKS_URL_GAMBAR = 2048;

export function urlGambarValid(nilai) {
  if (typeof nilai !== 'string') return false;
  const url = nilai.trim();
  if (url === '') return true;
  if (url.length > MAKS_URL_GAMBAR || url.startsWith('//')) return false;
  if (url.startsWith('/')) return true; // path lokal, bukan //host
  try {
    const { protocol, hostname } = new URL(url);
    return (protocol === 'https:' || protocol === 'http:') && hostname !== '';
  } catch {
    return false;
  }
}
```

**Test reproduksi (gagal sebelum patch, lulus sesudah):**

```js
expect(urlGambarValid('//evil.example/x.png')).toBe(false);
expect(urlGambarValid('http://')).toBe(false);
expect(urlGambarValid('javascript:alert(1)')).toBe(false);
expect(urlGambarValid('/images/placeholder.svg')).toBe(true);
expect(urlGambarValid('https://contoh.test/gambar.png')).toBe(true);
```

> Catatan migrasi: `validasiProduk` juga dipakai saat memuat localStorage. Jika pengguna sudah menyimpan gambar `//host`, patch ini akan menganggap seluruh data rusak dan memulihkan data contoh. Data contoh saat ini memakai `imageUrl: ''`, jadi risiko kehilangan data rendah; tetap perlu disebut di catatan rilis.

### SA-02 — Tidak ada batas panjang `imageUrl` dan batas ukuran berkas impor

| | |
| --- | --- |
| Tingkat | **Rendah** |
| Status | Terbukti |
| OWASP | A06:2025 Insecure Design, A10:2025 Mishandling of Exceptional Conditions |
| Lokasi | `src/validate.js:77` & `:159–160` (tanpa batas panjang); `src/dashboard.js:343–350` (berkas dibaca utuh); `index.html:103–104` (`accept` hanya saran) |

**Bukti eksekusi:**

```
imageUrl 100k char   -> true
harga 1e308          -> true
impor 51 item        -> false
impor 1MB string     -> false
```

**Risiko.** Panjang `imageUrl` tidak dibatasi (100.000 karakter diterima), sehingga satu produk dapat memenuhi kuota localStorage (~5 MB) dan memperlambat render. Impor memanggil `berkas.text()` tanpa memeriksa `berkas.size`, jadi berkas JSON berukuran sangat besar (ratusan MB/GB) dibaca sepenuhnya ke memori sebelum ditolak oleh validasi jumlah item — berpotensi membekukan tab. Ini hanya menyakiti pengguna sendiri (self-DoS), bukan pengguna lain, karena data lokal; tetapi tetap merupakan kegagalan penanganan kondisi ekstrem.

**Rekomendasi patch minimal.** Batasi panjang URL di `urlGambarValid` (lihat SA-01) dan periksa ukuran berkas sebelum membaca:

```js
// dashboard.js, sebelum berkas.text()
const BATAS_BERKAS_IMPOR = 512 * 1024; // 512 kB
if (berkas.size > BATAS_BERKAS_IMPOR) {
  tampilkanToast('Berkas terlalu besar (maksimal 512 kB).', 'galat');
  return;
}
```

**Test reproduksi:**

```js
expect(validasiProduk({ ...produk, imageUrl: 'https://contoh.test/' + 'a'.repeat(4096) }).ok).toBe(false);
expect(validasiProduk({ ...produk, imageUrl: 'https://contoh.test/' + 'a'.repeat(2048) }).ok).toBe(true);
// Untuk batas berkas: ekstrak helper murni `bolehImporBerkas({ size })` dan uji 513 kB -> false.
```

### SA-03 — `Boolean()` membuat string `"false"` bernilai unggulan `true`

| | |
| --- | --- |
| Tingkat | **Rendah** (laten, belum dapat dicapai dari UI) |
| Status | Terbukti |
| OWASP | A06:2025 Insecure Design, A08:2025 Software or Data Integrity Failures |
| Lokasi | `src/validate.js:174` |

**Bukti kode:**

```js
unggulan: Boolean(nilai.unggulan),
```

**Bukti eksekusi:**

```
unggulan string "false" -> true | ok: true
```

**Risiko.** Saat ini `unggulan` berasal dari `<input type="checkbox">` sehingga selalu boolean; tidak ada dampak nyata hari ini. Risiko muncul jika `validasiForm` dipakai ulang untuk data non-form (mis. impor atau API masa depan): layanan yang ditandai `"false"` justru menjadi unggulan.

**Rekomendasi patch minimal:**

```js
unggulan: nilai.unggulan === true,
```

**Test reproduksi:**

```js
expect(validasiForm({ ...formValid, unggulan: 'false' }).data.unggulan).toBe(false);
expect(validasiForm({ ...formValid, unggulan: true }).data.unggulan).toBe(true);
```

### SA-04 — Tidak ada CSP dan header keamanan

| | |
| --- | --- |
| Tingkat | **Rendah** (defense-in-depth) |
| Status | Terbukti absen |
| OWASP | A02:2025 Security Misconfiguration |
| Lokasi | `index.html:1–12` (tidak ada meta CSP), `index.html:281` (satu-satunya skrip), tidak ada konfigurasi hosting/header |

**Bukti.** `grep` pada `index.html` tidak menemukan `Content-Security-Policy`, `Referrer-Policy`, atau header lain; repo juga tidak memiliki konfigurasi `_headers`, `vercel.json`, atau `netlify.toml`. Tidak ada sumber eksternal selain `https://wa.me/` yang dibangun di `src/ui.js:21`.

**Risiko.** Karena semua render memakai `textContent` dan tidak ada `innerHTML`, tidak ada jalur XSS yang bisa dieksploitasi hari ini. Namun tanpa CSP dan `Referrer-Policy`, jika kelak ada satu sink HTML atau pustaka pihak ketiga, dampaknya tidak tertahan. URL gambar eksternal juga mengirim Referer halaman (kecuali dibatasi).

**Rekomendasi.** Terapkan lewat header server produksi (lebih kuat dari meta, karena meta tidak mendukung `frame-ancestors`):

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https: http:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
```

Jika harus lewat meta di `index.html`, gunakan versi tanpa `frame-ancestors` dan uji ulang `npm run dev` (Vite memakai WebSocket HMR sehingga `connect-src` perlu `ws:` pada mode pengembangan). Tambahan kecil: `gambar.referrerPolicy = 'no-referrer'` di `src/ui.js:87` untuk gambar eksternal.

**Test reproduksi (setelah patch):**

```js
const html = readFileSync('index.html', 'utf8');
expect(html).toMatch(/Content-Security-Policy/); // saat ini gagal
```

### SA-05 — localStorage menyimpan data tanpa enkripsi/integritas

| | |
| --- | --- |
| Tingkat | **Informasional** (diterima, sesuai desain demo) |
| Status | Terbukti |
| OWASP | A04:2025 Cryptographic Failures, A08:2025 Software or Data Integrity Failures |
| Lokasi | `src/store.js:29`, `:79`; kunci `rasanusa.products.v1` |

**Risiko.** Data katalog dapat dibaca/diubah siapa pun yang memiliki akses ke peramban (pengguna, ekstensi, XSS). Tidak ada rahasia, kredensial, atau data pribadi yang disimpan; integritas dipulihkan dengan validasi ketat saat muat (`src/store.js:61`) dan pemulihan data contoh (`src/state.js:12`). Ini konsisten dengan desain demo tanpa backend.

**Rekomendasi.** Tidak perlu enkripsi untuk data katalog publik. Jika nanti ada data pesanan/pelanggan, jangan simpan di localStorage; gunakan sesi server (sudah dirancang di `ARCHITECTURE.md`).

### SA-06 — Risiko supply chain sisa

| | |
| --- | --- |
| Tingkat | **Informasional** |
| Status | Terbukti |
| OWASP | A03:2025 Software Supply Chain Failures |
| Lokasi | `package.json:12–15`, `package-lock.json`, `.gitignore` |

**Bukti eksekusi:**

```
npm audit: {info:0, low:0, moderate:0, high:0, critical:0, total:0}
dependencies: {prod:1, dev:67, optional:34, peer:0}
resolved hosts: 67 × registry.npmjs.org
lockfileVersion: 3
```

Positif: tidak ada dependency runtime, lockfile di-commit, `node_modules` dan `dist` diabaikan (`.gitignore:1–2`), semua paket berasal dari registry resmi. Sisa risiko: rentang `^` pada `vite`/`vitest`, belum ada CI `npm ci`, belum ada Dependabot/SBOM, dan `vitest` menambah 67 paket dev ke permukaan build.

**Rekomendasi.** Tambahkan CI minimal `npm ci && npm test && npm run build && npm audit --audit-level=high`, aktifkan pembaruan dependensi otomatis, dan pertimbangkan `npm audit signatures`. Tidak perlu mengubah dependency sekarang.

### SA-07 — Nomor WhatsApp ada di bundle publik

| | |
| --- | --- |
| Tingkat | **Informasional** (bukan rahasia) |
| Status | Terbukti |
| OWASP | — (desain) |
| Lokasi | `src/products.js:4` |

**Bukti.** `WA_NOMOR = '6281234567890'` masuk ke `dist/assets/*.js`; nomor ini memang kontak bisnis yang ditampilkan di tombol pesan. Bukan API key/secret. Catatan: jika kelak diganti nomor asli pemilik, nomor tersebut akan selalu publik dan dapat dipanen; gunakan nomor khusus bisnis, bukan nomor pribadi.

### SA-08 — Dashboard dapat dibuka tanpa autentikasi

| | |
| --- | --- |
| Tingkat | **Informasional** (sesuai batasan proyek) |
| Status | Terbukti |
| OWASP | A01:2025 Broken Access Control, A07:2025 Authentication Failures |
| Lokasi | `index.html:20` (tab Dashboard), `src/main.js` (routing hash), tanpa backend |

**Risiko.** Siapa pun yang membuka situs dapat mengubah katalog **pada perambannya sendiri**; tidak ada data bersama yang terpengaruh karena seluruh data lokal. Ini eksplisit merupakan demo tanpa login, dan `ARCHITECTURE.md` sudah merancang RBAC berbasis server untuk versi produksi.

**Rekomendasi.** Jangan menambahkan login palsu. Saat backend diterapkan, ikuti rencana di `ARCHITECTURE.md` (sesi HttpOnly, RBAC server, RLS) dan jangan mengandalkan validasi klien.

### SA-09 — Data rusak dari tab lain tidak langsung ditulis ulang

| | |
| --- | --- |
| Tingkat | **Informasional** (ketahanan, bukan eksposur) |
| Status | Terbukti |
| OWASP | A10:2025 Mishandling of Exceptional Conditions |
| Lokasi | `src/state.js:12` vs `src/state.js:106–110` |

**Bukti eksekusi** (storage `[]`, lalu dirusak, lalu `perbaruiDariStorage()`):

```
setelah rusak -> status: rusak | memori: 8 | storage tetap: {rusak
```

**Risiko.** Setelah tab lain menulis data rusak, memori memakai data contoh dan toast galat muncul, tetapi localStorage tetap berisi data rusak sampai halaman dimuat ulang (perbaikan otomatis hanya terjadi saat init). Tidak ada dampak keamanan; hanya peringatan yang bisa berulang dan data yang tidak konsisten antar-tab.

**Rekomendasi (opsional).** Di `perbaruiDariStorage`, jika `hasil.status === 'rusak'`, panggil `simpanProduk(produk)` sekali agar sama dengan alur init. Test: stub localStorage, rusak setelah init, panggil fungsi, pastikan isi storage sudah dipulihkan.

## 4. Kontrol yang sudah benar (diverifikasi)

1. **Tidak ada sink HTML berbahaya.** `grep -rn "innerHTML\|outerHTML\|insertAdjacentHTML\|document.write\|eval(\|new Function"` pada `index.html`, `src/`, `public/` → **tidak ada hasil**. Semua teks dari pengguna dirender dengan `textContent`: nama/deskripsi/stok (`src/ui.js:124–144`), tabel dashboard (`src/dashboard.js:189`), toast (`src/dashboard.js:33`), dialog (`src/dashboard.js:94`). Atribut yang diisi data pengguna hanya `img.src` (divalidasi) dan `aria-label` (atribut, aman). Nama produk `<b>Uji</b>` akan tampil literal.
2. **WhatsApp aman.** Nomor dibersihkan ke digit dan diuji `^[1-9]\d{7,14}$` (`src/ui.js:14–15`), pesan di-`encodeURIComponent` (`src/ui.js:21`), tautan memakai `target="_blank"` + `rel="noopener noreferrer"` (`src/ui.js:168–169`). Tidak ada `window.open` tanpa rel.
3. **Impor JSON ketat.** `JSON.parse` dibungkus try/catch (`src/store.js:104`), lalu `validasiDaftarProduk` memeriksa array, maksimal 50 item, tipe setiap field, kategori baku, dan id unik (`src/store.js:109`, `src/validate.js:105–135`). Impor 51 item ditolak; string 1 MB ditolak sebagai bukan array. Data divalidasi **sebelum** `gantiSemua` dipanggil (`src/dashboard.js:356–362`).
4. **Prototype pollution tidak terjadi.** Impor dengan `__proto__` tetap valid tetapi hasilnya objek baru dengan field eksplisit; `({}).tercemar` tetap `undefined` (diverifikasi).
5. **Data localStorage divalidasi setiap muat**, termasuk array kosong yang dipertahankan dan pemulihan data contoh saat rusak (`src/store.js:29–66`); kegagalan simpan dikembalikan dengan rollback state (`src/state.js:34–50`).
6. **Tidak ada secret.** Pencarian `api key|secret|token|password|bearer|sk_live|AIza|ghp_|AKIA` hanya menemukan dokumentasi/rencana dan komentar skema; tidak ada `.env` di repo; `.env` di-`.gitignore` (baris 3); hasil build tidak memuat kredensial.
7. **Aset publik bersih.** Hanya `public/images/placeholder.svg`; tidak ada `<script>`, event handler, `foreignObject`, atau `href` di dalam SVG. `index.html` tidak memuat font/CDN/pihak ketiga; satu-satunya URL eksternal yang dibangun adalah `wa.me`.
8. **Dependency.** Tanpa dependency runtime; `npm audit` 0 kerentanan; lockfile v3 dari registry resmi.

## 5. Pemetaan OWASP Top 10:2025

| Kategori | Relevansi | Status di proyek |
| --- | --- | --- |
| A01 Broken Access Control | Dashboard tanpa login | Diterima sesuai batasan demo (SA-08); data hanya lokal, bukan data bersama |
| A02 Security Misconfiguration | Header/CSP | **SA-04** (rendah) |
| A03 Software Supply Chain Failures | Dependency dev | **SA-06** (informasional); audit 0, lockfile pin |
| A04 Cryptographic Failures | localStorage | **SA-05** (diterima; tanpa data sensitif) |
| A05 Injection | XSS & validasi URL | **SA-01** (rendah); tidak ada sink HTML, `javascript:` ditolak |
| A06 Insecure Design | Batas masukan/ukuran | **SA-02**, **SA-03** (rendah) |
| A07 Authentication Failures | Tidak ada autentikasi | Tidak berlaku (tanpa backend, sesuai instruksi); dirancang di `ARCHITECTURE.md` |
| A08 Software/Data Integrity | Data lokal & impor | SA-03, SA-05; validasi impor kuat, prototype pollution aman |
| A09 Logging & Alerting | Tidak ada logging | Tidak berlaku untuk demo statis; audit log dirancang untuk backend |
| A10 Mishandling of Exceptional Conditions | Parse/simpan gagal | Sebagian besar ditangani (try/catch, rollback); sisa **SA-02**, **SA-09** |

## 6. Rencana patch (menunggu persetujuan)

Tidak ada satu pun perubahan di bawah ini yang sudah diterapkan. Urutan dari risiko tertinggi yang terbukti:

### P1 — Perketat `urlGambarValid` (SA-01, SA-02)

- File: `src/validate.js` (`urlGambarValid`, baris 23–27).
- Tolak `//host`, wajibkan `hostname` untuk http/https, batasi 2048 karakter, trim konsisten.
- Tetap terima path lokal `/...` dan kosong, agar fitur gambar tidak berubah.

### P2 — Batasi ukuran berkas impor (SA-02)

- File: `src/dashboard.js` (sekitar baris 346).
- Tolak `berkas.size > 512 * 1024` sebelum `berkas.text()` dengan toast galat.
- Tidak menyentuh logika validasi isi yang sudah ada.

### P3 — Perbaiki konversi `unggulan` (SA-03)

- File: `src/validate.js:174` → `nilai.unggulan === true`.
- Tidak mengubah perilaku form (checkbox selalu boolean).

### P4 — Header keamanan (SA-04) — opsional, disarankan

- Tambahkan konfigurasi header pada hosting produksi (`_headers`/`vercel.json`) dan/atau meta CSP di `index.html`.
- Tambahkan `gambar.referrerPolicy = 'no-referrer'` di `src/ui.js`.
- Uji `npm run dev` (HMR) dan `npm run preview` setelahnya.

### P5 — CI supply chain (SA-06) — opsional

- Workflow `npm ci`, `npm test`, `npm run build`, `npm audit --audit-level=high`; aktifkan Dependabot. Tidak mengubah dependency aplikasi.

## 7. Test keamanan yang akan ditambahkan setelah persetujuan

File baru `src/security.test.js` (bahasa Vitest, mengikuti gaya `src/*.test.js` yang ada):

| Test | Temuan | Hasil sebelum patch |
| --- | --- | --- |
| `urlGambarValid('//evil.example/x.png') === false` | SA-01 | **gagal** (saat ini `true`) |
| `urlGambarValid('http://') === false` | SA-01 | **gagal** |
| `urlGambarValid('javascript:...') === false` | SA-01 | lulus (sudah aman) |
| `validasiProduk` menolak `imageUrl` > 2048 | SA-02 | **gagal** |
| helper batas berkas menolak 513 kB | SA-02 | **gagal** (helper belum ada) |
| `validasiForm({ unggulan: 'false' }).data.unggulan === false` | SA-03 | **gagal** (saat ini `true`) |
| impor dengan `__proto__` tidak mencemari `Object.prototype` | A08 | lulus (regresi) |
| impor 51 item / JSON rusak / `javascript:` ditolak | A05/A08 | lulus (regresi) |
| `index.html` mengandung `Content-Security-Policy` | SA-04 | **gagal** |
| pemindaian sumber tidak memuat `innerHTML`/`eval` | A05 | lulus (penjaga regresi) |
| tidak ada pola secret pada `index.html`/`src`/`public` | A04 | lulus (penjaga regresi) |

Estimasi: ~10 test baru, tanpa dependency tambahan.

## 8. Regression test setelah patch

1. `npm test` — 39 test lama harus tetap lulus + test keamanan baru.
2. `npm run build` — memastikan CSP/perubahan tidak memutus build.
3. Uji manual singkat di peramban: tambah/ubah/hapus, ekspor, impor (valid, rusak, terlalu besar), reset, tombol WhatsApp, serta mode gelap/terang tidak relevan.
4. Verifikasi data lama: buka dengan localStorage berisi `imageUrl` eksternal normal (`https://...`) dan path lokal; pastikan tidak dianggap rusak.

## 9. Batasan audit

- Tidak ada uji end-to-end/peramban; klaim XSS didasarkan pada ketiadaan sink HTML dan penggunaan `textContent`, bukan eksploitasi di DOM.
- `npm audit` bergantung pada advisory database saat audit dijalankan.
- Backend, autentikasi, dan deployment produksi di luar cakupan karena belum ada di repo; rekomendasi masa depan mengacu ke `ARCHITECTURE.md`.
- Audit ini tidak menguji keamanan hosting, DNS, TLS, atau konfigurasi server.

## 10. Lampiran: perintah verifikasi

```bash
grep -rn "innerHTML\|outerHTML\|insertAdjacentHTML\|document.write\|eval(\|new Function" index.html src public
grep -rniE "api[_-]?key|secret|token|password|bearer|sk_live|sk_test|AKIA|AIza|ghp_|private[_-]?key" index.html src public *.md
npm audit --json
grep -o '"resolved": "[^"]*"' package-lock.json | sed 's#.*https\?://##; s#/.*##' | sort | uniq -c
node --input-type=module -e "import {urlGambarValid} from './src/validate.js'; console.log(urlGambarValid('//evil.example/x.png'), urlGambarValid('http://'));"
node --input-type=module -e "import {validasiForm} from './src/validate.js'; console.log(validasiForm({nama:'Kebaya Baru',kategori:'Wanita',harga:'450000',stok:'3',deskripsi:'Kebaya brokat bordir halus.',imageUrl:'',unggulan:'false'}).data.unggulan);"
```
