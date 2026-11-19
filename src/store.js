import { PRODUCTS } from './products.js';
import { validasiDaftarProduk } from './validate.js';

/** Kunci penyimpanan sesuai SPEC.md bagian F-10. */
export const STORAGE_KEY = 'rasanusa.products.v1';

/** Salinan dalam agar data contoh tidak termutasi. */
function salinDataContoh() {
  return PRODUCTS.map((produk) => ({ ...produk }));
}

/** ID unik sederhana untuk produk baru, mis. "p-lx3k9a2f". */
export function buatId() {
  return `p-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Muat produk dari localStorage.
 * Status:
 * - "contoh"     : key belum ada, data contoh dipakai (belum disimpan)
 * - "tersimpan"  : data valid dari localStorage (termasuk array kosong)
 * - "rusak"      : JSON rusak / struktur tidak valid, data contoh dipulihkan
 * - "gagal-baca" : localStorage tidak dapat diakses
 * @returns {{ produk: Array, status: 'contoh'|'tersimpan'|'rusak'|'gagal-baca', pesan: string }}
 */
export function muatProduk() {
  let mentah;
  try {
    mentah = localStorage.getItem(STORAGE_KEY);
  } catch {
    return {
      produk: salinDataContoh(),
      status: 'gagal-baca',
      pesan: 'Penyimpanan peramban tidak dapat diakses. Data contoh dipakai untuk sesi ini.',
    };
  }

  if (mentah === null) {
    return { produk: salinDataContoh(), status: 'contoh', pesan: '' };
  }

  let terurai;
  try {
    terurai = JSON.parse(mentah);
  } catch {
    return {
      produk: salinDataContoh(),
      status: 'rusak',
      pesan: 'Data tersimpan rusak dan tidak dapat dibaca. Data contoh dipulihkan.',
    };
  }

  if (!Array.isArray(terurai)) {
    return {
      produk: salinDataContoh(),
      status: 'rusak',
      pesan: 'Data tersimpan bukan array layanan. Data contoh dipulihkan.',
    };
  }

  const cek = validasiDaftarProduk(terurai);
  if (!cek.ok) {
    return {
      produk: salinDataContoh(),
      status: 'rusak',
      pesan: `${cek.pesan} Data contoh dipulihkan.`,
    };
  }

  return { produk: cek.produk, status: 'tersimpan', pesan: '' };
}

/**
 * Simpan produk ke localStorage.
 * @returns {{ ok: boolean, error: Error | null }}
 */
export function simpanProduk(produk) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produk));
    return { ok: true, error: null };
  } catch (error) {
    return { ok: false, error };
  }
}

/** Kembalikan delapan data contoh lalu simpan. */
export function resetProduk() {
  const contoh = salinDataContoh();
  return { produk: contoh, ...simpanProduk(contoh) };
}

/** Teks JSON siap unduh untuk seluruh data produk. */
export function buatJsonEkspor(produk) {
  return `${JSON.stringify(produk, null, 2)}\n`;
}

/**
 * Urai dan validasi teks JSON hasil impor sebelum mengganti data tersimpan.
 * @returns {{ ok: boolean, produk?: Array, pesan?: string }}
 */
export function bacaImporJson(teks) {
  let terurai;
  try {
    terurai = JSON.parse(teks);
  } catch {
    return { ok: false, pesan: 'Berkas bukan JSON yang valid.' };
  }

  const cek = validasiDaftarProduk(terurai);
  if (!cek.ok) return { ok: false, pesan: cek.pesan };

  return { ok: true, produk: cek.produk };
}
