import { describe, expect, it } from 'vitest';
import { PRODUCTS } from './products.js';
import {
  BATAS_MAKS_PRODUK,
  validasiDaftarProduk,
  validasiForm,
  validasiProduk,
} from './validate.js';

const formValid = (ubah = {}) => ({
  nama: 'Kebaya Baru',
  kategori: 'Wanita',
  harga: '450000',
  stok: '3',
  deskripsi: 'Kebaya brokat dengan bordir halus.',
  imageUrl: '',
  unggulan: true,
  ...ubah,
});

describe('validasiForm', () => {
  it('menerima form valid dan mengubah tipe angka/boolean', () => {
    const hasil = validasiForm(formValid({ unggulan: false }));

    expect(hasil.ok).toBe(true);
    expect(hasil.data).toMatchObject({ harga: 450000, stok: 3, unggulan: false });
  });

  it('menolak harga negatif dan harga kosong', () => {
    expect(validasiForm(formValid({ harga: '-1' })).errors.harga).toBeTruthy();
    expect(validasiForm(formValid({ harga: '' })).errors.harga).toBeTruthy();
    expect(validasiForm(formValid({ harga: 'abc' })).errors.harga).toBeTruthy();
  });

  it('menerima harga 0 sebagai batas bawah', () => {
    expect(validasiForm(formValid({ harga: '0' })).ok).toBe(true);
  });

  it('menolak stok negatif, desimal, dan kosong', () => {
    expect(validasiForm(formValid({ stok: '-1' })).errors.stok).toBeTruthy();
    expect(validasiForm(formValid({ stok: '2.5' })).errors.stok).toBeTruthy();
    expect(validasiForm(formValid({ stok: '2,5' })).errors.stok).toBeTruthy();
    expect(validasiForm(formValid({ stok: '' })).errors.stok).toBeTruthy();
  });

  it('menerima stok 0 sebagai batas bawah', () => {
    const hasil = validasiForm(formValid({ stok: '0' }));

    expect(hasil.ok).toBe(true);
    expect(hasil.data.stok).toBe(0);
  });

  it('menolak nama terlalu pendek/panjang dan deskripsi tidak sesuai batas', () => {
    expect(validasiForm(formValid({ nama: 'ab' })).errors.nama).toBeTruthy();
    expect(validasiForm(formValid({ nama: 'a'.repeat(71) })).errors.nama).toBeTruthy();
    expect(validasiForm(formValid({ deskripsi: 'abc' })).errors.deskripsi).toBeTruthy();
    expect(validasiForm(formValid({ deskripsi: 'a'.repeat(241) })).errors.deskripsi).toBeTruthy();
  });

  it('menolak kategori di luar daftar baku', () => {
    expect(validasiForm(formValid({ kategori: 'Anak' })).errors.kategori).toBeTruthy();
    expect(validasiForm(formValid({ kategori: '' })).errors.kategori).toBeTruthy();
  });

  it('menolak URL gambar dengan skema terlarang dan menerima path lokal/HTTPS', () => {
    expect(validasiForm(formValid({ imageUrl: 'javascript:alert(1)' })).errors.imageUrl).toBeTruthy();
    expect(validasiForm(formValid({ imageUrl: 'ftp://contoh/gambar.png' })).errors.imageUrl).toBeTruthy();
    expect(validasiForm(formValid({ imageUrl: '/images/kebaya.svg' })).ok).toBe(true);
    expect(validasiForm(formValid({ imageUrl: 'https://contoh.test/kebaya.png' })).ok).toBe(true);
  });
});

describe('validasiProduk', () => {
  it('menerima produk sesuai model dan memangkas spasi teks', () => {
    const hasil = validasiProduk({ ...PRODUCTS[0], nama: '  Kebaya Modern Bordir  ' });

    expect(hasil.ok).toBe(true);
    expect(hasil.produk.nama).toBe('Kebaya Modern Bordir');
  });

  it('menolak payload bukan objek (null, array, string)', () => {
    expect(validasiProduk(null).ok).toBe(false);
    expect(validasiProduk([]).ok).toBe(false);
    expect(validasiProduk('produk').ok).toBe(false);
  });

  it('menolak tipe field yang salah dan kategori tak valid', () => {
    expect(validasiProduk({ ...PRODUCTS[0], stok: '3' }).ok).toBe(false);
    expect(validasiProduk({ ...PRODUCTS[0], stok: 2.5 }).ok).toBe(false);
    expect(validasiProduk({ ...PRODUCTS[0], harga: '450000' }).ok).toBe(false);
    expect(validasiProduk({ ...PRODUCTS[0], unggulan: 'ya' }).ok).toBe(false);
    expect(validasiProduk({ ...PRODUCTS[0], kategori: 'Anak' }).ok).toBe(false);
  });
});

describe('validasiDaftarProduk', () => {
  it('menerima data contoh dan array kosong', () => {
    expect(validasiDaftarProduk(PRODUCTS).ok).toBe(true);
    expect(validasiDaftarProduk([])).toEqual({ ok: true, produk: [] });
  });

  it('menolak data yang bukan array dan id ganda', () => {
    expect(validasiDaftarProduk({}).ok).toBe(false);
    expect(validasiDaftarProduk('[]').ok).toBe(false);
    expect(validasiDaftarProduk([PRODUCTS[0], { ...PRODUCTS[1], id: PRODUCTS[0].id }]).ok).toBe(false);
  });

  it('menolak daftar melebihi batas demo', () => {
    const banyak = Array.from({ length: BATAS_MAKS_PRODUK + 1 }, (_, i) => ({
      ...PRODUCTS[0],
      id: `p-uji-${i}`,
    }));

    expect(validasiDaftarProduk(banyak).ok).toBe(false);
  });
});
