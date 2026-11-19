import { KATEGORI, PLACEHOLDER_IMAGE } from './products.js';

/** Format angka menjadi Rupiah, mis. 450000 -> "Rp 450.000". */
export function formatRupiah(nilai) {
  return `Rp ${new Intl.NumberFormat('id-ID').format(nilai)}`;
}

/**
 * Bangun URL WhatsApp untuk pemesanan satu produk.
 * Nomor harus format internasional (8–15 digit, tanpa awalan 0).
 * Mengembalikan string kosong bila nomor tidak valid.
 */
export function buildWhatsAppUrl(nomor, produk) {
  const digit = String(nomor ?? '').replace(/[\s\-().+]/g, '');
  if (!/^[1-9]\d{7,14}$/.test(digit)) return '';

  const pesan = `Halo JahitSuka, saya ingin memesan ${produk.nama} (${formatRupiah(
    produk.harga,
  )}). Apakah masih tersedia?`;

  return `https://wa.me/${digit}?text=${encodeURIComponent(pesan)}`;
}

function bandingNama(a, b) {
  return a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' });
}

function pembanding(urutan) {
  switch (urutan) {
    case 'harga-terendah':
      return (a, b) => a.harga - b.harga || bandingNama(a, b);
    case 'harga-tertinggi':
      return (a, b) => b.harga - a.harga || bandingNama(a, b);
    case 'nama-az':
      return bandingNama;
    case 'stok-terbanyak':
      return (a, b) => b.stok - a.stok || bandingNama(a, b);
    case 'unggulan':
    default:
      return (a, b) => {
        if (a.unggulan !== b.unggulan) return a.unggulan ? -1 : 1;
        return bandingNama(a, b);
      };
  }
}

/**
 * Fungsi murni: saring lalu urutkan produk tanpa mengubah data masukan.
 * @param {Array} daftar produk asal
 * @param {{ query?: string, kategori?: string, urutan?: string }} opsi
 */
export function filterProducts(daftar, { query = '', kategori = 'Semua kategori', urutan = 'unggulan' } = {}) {
  const kataKunci = query.trim().toLowerCase();

  const hasil = daftar.filter((produk) => {
    const cocokKategori = kategori === 'Semua kategori' || produk.kategori === kategori;
    if (!cocokKategori) return false;
    if (kataKunci === '') return true;

    return (
      produk.nama.toLowerCase().includes(kataKunci) ||
      produk.kategori.toLowerCase().includes(kataKunci) ||
      produk.deskripsi.toLowerCase().includes(kataKunci)
    );
  });

  return [...hasil].sort(pembanding(urutan));
}

/** Isi opsi filter kategori: "Semua kategori" + lima kategori baku. */
export function renderOpsiKategori(select, kategori = KATEGORI) {
  select.replaceChildren();

  for (const nama of ['Semua kategori', ...kategori]) {
    const opsi = document.createElement('option');
    opsi.value = nama;
    opsi.textContent = nama;
    select.append(opsi);
  }
}

function buatGambar(produk) {
  const bingkai = document.createElement('div');
  bingkai.className = 'product-media';

  const gambar = document.createElement('img');
  gambar.src = produk.imageUrl || PLACEHOLDER_IMAGE;
  gambar.alt = `Foto layanan ${produk.nama}`;
  gambar.loading = 'lazy';
  gambar.decoding = 'async';

  // Gambar eksternal/lokal yang gagal dimuat diganti placeholder lokal.
  gambar.addEventListener(
    'error',
    () => {
      if (gambar.src.endsWith(PLACEHOLDER_IMAGE)) return;
      gambar.src = PLACEHOLDER_IMAGE;
    },
    { once: true },
  );

  bingkai.append(gambar);
  return bingkai;
}

function buatKartu(produk, waNomor) {
  const kartu = document.createElement('article');
  kartu.className = 'product-card';

  kartu.append(buatGambar(produk));

  const isi = document.createElement('div');
  isi.className = 'product-body';

  if (produk.unggulan) {
    const label = document.createElement('span');
    label.className = 'badge-featured';
    label.textContent = 'Unggulan';
    isi.append(label);
  }

  const nama = document.createElement('h3');
  nama.className = 'product-name';
  nama.textContent = produk.nama;
  isi.append(nama);

  const meta = document.createElement('p');
  meta.className = 'product-meta';
  meta.textContent = produk.kategori;
  isi.append(meta);

  const harga = document.createElement('p');
  harga.className = 'product-price';
  harga.textContent = formatRupiah(produk.harga);
  isi.append(harga);

  const stok = document.createElement('p');
  stok.className = produk.stok === 0 ? 'product-stock is-out' : 'product-stock';
  stok.textContent = produk.stok === 0 ? 'Stok habis' : `Stok: ${produk.stok}`;
  isi.append(stok);

  const deskripsi = document.createElement('p');
  deskripsi.className = 'product-desc';
  deskripsi.textContent = produk.deskripsi;
  isi.append(deskripsi);

  isi.append(buatTombolPesan(produk, waNomor));
  kartu.append(isi);

  return kartu;
}

function buatTombolPesan(produk, waNomor) {
  const url = buildWhatsAppUrl(waNomor, produk);

  if (produk.stok === 0 || url === '') {
    const tombol = document.createElement('button');
    tombol.type = 'button';
    tombol.className = 'btn btn-order';
    tombol.disabled = true;
    tombol.textContent = produk.stok === 0 ? 'Stok habis' : 'Pemesanan tidak tersedia';
    return tombol;
  }

  const tautan = document.createElement('a');
  tautan.className = 'btn btn-order';
  tautan.href = url;
  tautan.target = '_blank';
  tautan.rel = 'noopener noreferrer';
  tautan.textContent = 'Pesan via WhatsApp';
  return tautan;
}

function buatKeadaanKosong({ adaFilter, onBersihkan }) {
  const kosong = document.createElement('div');
  kosong.className = 'empty-state';

  const judul = document.createElement('p');
  judul.className = 'empty-title';
  judul.textContent = adaFilter
    ? 'Tidak ada layanan yang cocok.'
    : 'Belum ada layanan pada katalog.';

  const pesan = document.createElement('p');
  pesan.textContent = adaFilter
    ? 'Coba kata kunci lain atau kembali ke semua kategori.'
    : 'Tambahkan layanan melalui dashboard untuk mengisi katalog.';

  kosong.append(judul, pesan);

  if (adaFilter) {
    const bersihkan = document.createElement('button');
    bersihkan.type = 'button';
    bersihkan.className = 'btn btn-secondary';
    bersihkan.textContent = 'Bersihkan pencarian';
    bersihkan.addEventListener('click', onBersihkan);
    kosong.append(bersihkan);
  }

  return kosong;
}

/**
 * Render hasil ke grid katalog.
 * @param {{
 *   wadah: HTMLElement,
 *   daftar: Array,
 *   jumlahEl: HTMLElement | null,
 *   totalSemua: number,
 *   adaFilter: boolean,
 *   waNomor: string,
 *   onBersihkan: () => void
 * }} opsi
 */
export function renderKatalog({ wadah, daftar, jumlahEl, totalSemua, adaFilter, waNomor, onBersihkan }) {
  wadah.replaceChildren();

  if (daftar.length === 0) {
    wadah.append(buatKeadaanKosong({ adaFilter, onBersihkan }));
  } else {
    for (const produk of daftar) {
      wadah.append(buatKartu(produk, waNomor));
    }
  }

  if (jumlahEl) {
    jumlahEl.textContent =
      daftar.length === totalSemua
        ? `Menampilkan ${daftar.length} layanan`
        : `Menampilkan ${daftar.length} dari ${totalSemua} layanan`;
  }
}
// uji tulis
