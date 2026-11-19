import { muatProduk, simpanProduk, resetProduk, buatId } from './store.js';
import { BATAS_MAKS_PRODUK } from './validate.js';

const awal = muatProduk();

/** Satu-satunya sumber data di memori untuk katalog dan dashboard. */
let produk = awal.produk;

export const statusAwal = { status: awal.status, pesan: awal.pesan };

// Data rusak dipulihkan sekali agar peringatan tidak berulang setiap muat.
if (awal.status === 'rusak') simpanProduk(produk);

const pendengar = new Set();

export function getProduk() {
  return produk;
}

/** Daftarkan fungsi render; dipanggil setiap data berubah. */
export function subscribe(fungsi) {
  pendengar.add(fungsi);
  return () => pendengar.delete(fungsi);
}

function beritahu() {
  for (const fungsi of pendengar) fungsi(produk);
}

/**
 * Terapkan perubahan, simpan, lalu beri tahu tampilan.
 * Bila penyimpanan gagal, state memori dikembalikan agar UI tidak berbohong.
 */
function terapkan(baru) {
  const sebelumnya = produk;
  produk = baru;

  const hasil = simpanProduk(produk);
  if (!hasil.ok) {
    produk = sebelumnya;
    beritahu();
    return {
      ok: false,
      pesan: 'Perubahan gagal disimpan. Penyimpanan peramban mungkin penuh atau diblokir.',
    };
  }

  beritahu();
  return { ok: true, pesan: '' };
}

function idBaru() {
  let id = buatId();
  while (produk.some((item) => item.id === id)) id = buatId();
  return id;
}

/** Tambah layanan dari data form yang sudah divalidasi. */
export function tambahProduk(data) {
  if (produk.length >= BATAS_MAKS_PRODUK) {
    return { ok: false, pesan: `Maksimal ${BATAS_MAKS_PRODUK} layanan untuk demo ini.` };
  }

  return terapkan([...produk, { id: idBaru(), ...data }]);
}

/** Ubah layanan berdasarkan id. */
export function ubahProduk(id, data) {
  if (!produk.some((item) => item.id === id)) {
    return { ok: false, pesan: 'Layanan yang ingin diubah tidak ditemukan.' };
  }

  return terapkan(produk.map((item) => (item.id === id ? { id, ...data } : item)));
}

/** Hapus layanan berdasarkan id. */
export function hapusProduk(id) {
  if (!produk.some((item) => item.id === id)) {
    return { ok: false, pesan: 'Layanan yang ingin dihapus tidak ditemukan.' };
  }

  return terapkan(produk.filter((item) => item.id !== id));
}

/** Ganti seluruh data (dipakai impor JSON yang sudah divalidasi). */
export function gantiSemua(daftar) {
  return terapkan(daftar.map((item) => ({ ...item })));
}

/** Muat ulang delapan data contoh. */
export function muatUlangContoh() {
  const hasil = resetProduk();
  if (!hasil.ok) {
    return {
      ok: false,
      pesan: 'Data contoh gagal disimpan. Penyimpanan peramban mungkin penuh atau diblokir.',
    };
  }

  produk = hasil.produk;
  beritahu();
  return { ok: true, pesan: '' };
}

/** Sinkronkan ulang dari localStorage (mis. tab lain mengubah data). */
export function perbaruiDariStorage() {
  const hasil = muatProduk();
  produk = hasil.produk;
  beritahu();
  return hasil;
}
