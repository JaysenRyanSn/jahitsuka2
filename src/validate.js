import { KATEGORI } from './products.js';

/** Batas praktis jumlah layanan untuk kenyamanan demo (NF-12). */
export const BATAS_MAKS_PRODUK = 50;

export const PESAN_VALIDASI = {
  nama: 'Nama layanan wajib diisi, 3–70 karakter.',
  kategori: `Kategori harus salah satu dari: ${KATEGORI.join(', ')}.`,
  harga: 'Harga wajib berupa angka dan tidak boleh kurang dari 0.',
  stok: 'Stok wajib bilangan bulat dan tidak boleh kurang dari 0.',
  deskripsi: 'Deskripsi wajib diisi, 5–240 karakter.',
  imageUrl: 'URL gambar harus diawali http://, https://, atau /.',
  unggulan: 'Status unggulan harus bernilai true atau false.',
  id: 'Setiap layanan harus punya id teks yang unik.',
  struktur: 'Data harus berupa array objek layanan.',
  batas: `Maksimal ${BATAS_MAKS_PRODUK} layanan untuk demo ini.`,
};

export function kategoriValid(nilai) {
  return typeof nilai === 'string' && KATEGORI.includes(nilai);
}

export function urlGambarValid(nilai) {
  if (typeof nilai !== 'string') return false;
  if (nilai === '') return true;
  return /^(https?:\/\/|\/)/.test(nilai);
}

function teks(nilai) {
  return typeof nilai === 'string' ? nilai.trim() : '';
}

function angkaDari(nilai) {
  if (typeof nilai === 'number') return Number.isFinite(nilai) ? nilai : NaN;
  const mentah = teks(nilai);
  if (mentah === '') return NaN;
  return Number(mentah);
}

/**
 * Validasi satu objek produk secara ketat (dipakai untuk data localStorage
 * dan berkas impor JSON). Semua field wajib ada dengan tipe yang benar.
 * @returns {{ ok: boolean, produk?: object, field?: string, pesan?: string }}
 */
export function validasiProduk(kandidat) {
  if (kandidat === null || typeof kandidat !== 'object' || Array.isArray(kandidat)) {
    return { ok: false, field: 'struktur', pesan: 'Setiap layanan harus berupa objek.' };
  }

  const id = teks(kandidat.id);
  if (id === '') return { ok: false, field: 'id', pesan: PESAN_VALIDASI.id };

  const nama = teks(kandidat.nama);
  if (nama.length < 3 || nama.length > 70) {
    return { ok: false, field: 'nama', pesan: PESAN_VALIDASI.nama };
  }

  if (!kategoriValid(kandidat.kategori)) {
    return { ok: false, field: 'kategori', pesan: PESAN_VALIDASI.kategori };
  }

  const harga = kandidat.harga;
  if (typeof harga !== 'number' || !Number.isFinite(harga) || harga < 0) {
    return { ok: false, field: 'harga', pesan: PESAN_VALIDASI.harga };
  }

  const stok = kandidat.stok;
  if (typeof stok !== 'number' || !Number.isInteger(stok) || stok < 0) {
    return { ok: false, field: 'stok', pesan: PESAN_VALIDASI.stok };
  }

  const deskripsi = teks(kandidat.deskripsi);
  if (deskripsi.length < 5 || deskripsi.length > 240) {
    return { ok: false, field: 'deskripsi', pesan: PESAN_VALIDASI.deskripsi };
  }

  if (typeof kandidat.imageUrl !== 'string' || !urlGambarValid(kandidat.imageUrl)) {
    return { ok: false, field: 'imageUrl', pesan: PESAN_VALIDASI.imageUrl };
  }

  if (typeof kandidat.unggulan !== 'boolean') {
    return { ok: false, field: 'unggulan', pesan: PESAN_VALIDASI.unggulan };
  }

  return {
    ok: true,
    produk: {
      id,
      nama,
      kategori: kandidat.kategori,
      harga,
      stok,
      deskripsi,
      imageUrl: teks(kandidat.imageUrl),
      unggulan: kandidat.unggulan,
    },
  };
}

/**
 * Validasi array produk lengkap (localStorage / impor JSON).
 * Memeriksa bentuk array, batas jumlah, setiap field, dan keunikan id.
 * @returns {{ ok: boolean, produk?: Array, pesan?: string }}
 */
export function validasiDaftarProduk(nilai) {
  if (!Array.isArray(nilai)) {
    return { ok: false, pesan: PESAN_VALIDASI.struktur };
  }
  if (nilai.length > BATAS_MAKS_PRODUK) {
    return { ok: false, pesan: PESAN_VALIDASI.batas };
  }

  const produk = [];
  const idTerpakai = new Set();

  for (let i = 0; i < nilai.length; i += 1) {
    const hasil = validasiProduk(nilai[i]);
    if (!hasil.ok) {
      return {
        ok: false,
        pesan: `Layanan ke-${i + 1} tidak valid: ${hasil.pesan}`,
      };
    }
    if (idTerpakai.has(hasil.produk.id)) {
      return {
        ok: false,
        pesan: `Layanan ke-${i + 1} memakai id ganda ("${hasil.produk.id}").`,
      };
    }
    idTerpakai.add(hasil.produk.id);
    produk.push(hasil.produk);
  }

  return { ok: true, produk };
}

/**
 * Validasi nilai form tambah/ubah. Input angka masih berupa teks.
 * @returns {{ ok: boolean, data?: object, errors: Record<string, string> }}
 */
export function validasiForm(nilai) {
  const errors = {};

  const nama = teks(nilai.nama);
  if (nama.length < 3 || nama.length > 70) errors.nama = PESAN_VALIDASI.nama;

  if (!kategoriValid(nilai.kategori)) errors.kategori = PESAN_VALIDASI.kategori;

  const harga = angkaDari(nilai.harga);
  if (!Number.isFinite(harga) || harga < 0) errors.harga = PESAN_VALIDASI.harga;

  const stokTeks = teks(String(nilai.stok ?? ''));
  const stok = Number(stokTeks);
  if (!/^\d+$/.test(stokTeks) || !Number.isSafeInteger(stok)) errors.stok = PESAN_VALIDASI.stok;

  const deskripsi = teks(nilai.deskripsi);
  if (deskripsi.length < 5 || deskripsi.length > 240) errors.deskripsi = PESAN_VALIDASI.deskripsi;

  const imageUrl = teks(nilai.imageUrl);
  if (!urlGambarValid(imageUrl)) errors.imageUrl = PESAN_VALIDASI.imageUrl;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    errors,
    data: {
      nama,
      kategori: nilai.kategori,
      harga,
      stok,
      deskripsi,
      imageUrl,
      unggulan: Boolean(nilai.unggulan),
    },
  };
}
