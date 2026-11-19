import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PRODUCTS } from './products.js';
import {
  STORAGE_KEY,
  bacaImporJson,
  buatJsonEkspor,
  muatProduk,
  simpanProduk,
} from './store.js';

let simpanan;

beforeEach(() => {
  simpanan = new Map();
  vi.stubGlobal('localStorage', {
    getItem: (kunci) => (simpanan.has(kunci) ? simpanan.get(kunci) : null),
    setItem: (kunci, nilai) => {
      simpanan.set(kunci, String(nilai));
    },
    removeItem: (kunci) => {
      simpanan.delete(kunci);
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('muatProduk (parser localStorage)', () => {
  it('memakai 8 data contoh bila kunci belum ada', () => {
    const hasil = muatProduk();

    expect(hasil.status).toBe('contoh');
    expect(hasil.produk).toHaveLength(8);
    expect(hasil.produk).toEqual(PRODUCTS);
  });

  it('mempertahankan array kosong tanpa mengisi ulang data contoh', () => {
    simpanan.set(STORAGE_KEY, '[]');

    const hasil = muatProduk();

    expect(hasil.status).toBe('tersimpan');
    expect(hasil.produk).toEqual([]);
  });

  it('memulihkan data contoh saat JSON rusak', () => {
    simpanan.set(STORAGE_KEY, '{"produk": [}');

    const hasil = muatProduk();

    expect(hasil.status).toBe('rusak');
    expect(hasil.produk).toHaveLength(8);
    expect(hasil.pesan).toMatch(/rusak/i);
  });

  it('menolak payload yang bukan array', () => {
    simpanan.set(STORAGE_KEY, JSON.stringify({ id: 'p-1', nama: 'Bukan array' }));

    const hasil = muatProduk();

    expect(hasil.status).toBe('rusak');
    expect(hasil.produk).toHaveLength(8);
  });

  it('menolak array berisi produk tidak valid (stok negatif, unggulan salah tipe)', () => {
    simpanan.set(STORAGE_KEY, JSON.stringify([{ ...PRODUCTS[0], stok: -1 }]));
    expect(muatProduk().status).toBe('rusak');

    simpanan.set(STORAGE_KEY, JSON.stringify([{ ...PRODUCTS[0], unggulan: 'ya' }]));
    expect(muatProduk().status).toBe('rusak');

    simpanan.set(
      STORAGE_KEY,
      JSON.stringify([PRODUCTS[0], { ...PRODUCTS[1], id: PRODUCTS[0].id }]),
    );
    expect(muatProduk().status).toBe('rusak');
  });

  it('menerima data valid dan mengabaikan field di luar model', () => {
    simpanan.set(
      STORAGE_KEY,
      JSON.stringify([{ ...PRODUCTS[0], kategori: 'Wanita', catatanInternal: 'buang' }]),
    );

    const hasil = muatProduk();

    expect(hasil.status).toBe('tersimpan');
    expect(hasil.produk).toHaveLength(1);
    expect(hasil.produk[0]).not.toHaveProperty('catatanInternal');
  });

  it('melaporkan gagal-baca bila localStorage tidak dapat diakses', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    });

    const hasil = muatProduk();

    expect(hasil.status).toBe('gagal-baca');
    expect(hasil.produk).toHaveLength(8);
  });

  it('melaporkan kegagalan saat penyimpanan menolak penulisan', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
    });

    const hasil = simpanProduk(PRODUCTS);

    expect(hasil.ok).toBe(false);
    expect(hasil.error).toBeInstanceOf(Error);
  });
});

describe('bacaImporJson', () => {
  it('menerima hasil ekspor dan mengembalikan produk yang sama', () => {
    const cek = bacaImporJson(buatJsonEkspor(PRODUCTS));

    expect(cek.ok).toBe(true);
    expect(cek.produk).toHaveLength(8);
    expect(cek.produk[0].nama).toBe(PRODUCTS[0].nama);
  });

  it('menolak JSON rusak tanpa melempar error', () => {
    expect(bacaImporJson('{rusak').ok).toBe(false);
    expect(bacaImporJson('').ok).toBe(false);
  });

  it('menolak payload dengan struktur/tipe salah dan kategori tak valid', () => {
    expect(bacaImporJson('{"produk": []}').ok).toBe(false);
    expect(bacaImporJson(JSON.stringify([{ ...PRODUCTS[0], harga: -5 }])).ok).toBe(false);
    expect(bacaImporJson(JSON.stringify([{ ...PRODUCTS[0], kategori: 'Anak' }])).ok).toBe(false);
  });

  it('menerima impor array kosong', () => {
    const cek = bacaImporJson('[]');

    expect(cek.ok).toBe(true);
    expect(cek.produk).toEqual([]);
  });
});
