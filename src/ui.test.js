import { describe, expect, it } from 'vitest';
import { PRODUCTS } from './products.js';
import { buildWhatsAppUrl, filterProducts } from './ui.js';

describe('filterProducts', () => {
  it('mencari nama tanpa peduli huruf besar/kecil', () => {
    const hasil = filterProducts(PRODUCTS, { query: 'KEBAYA' });

    expect(hasil).toHaveLength(1);
    expect(hasil[0].nama).toBe('Kebaya Modern Bordir');
  });

  it('mencari pada deskripsi dan kategori', () => {
    expect(filterProducts(PRODUCTS, { query: 'songket' })).toHaveLength(1);
    expect(filterProducts(PRODUCTS, { query: 'permak' }).length).toBeGreaterThan(0);
  });

  it('menyaring kategori Wanita menjadi 3 layanan', () => {
    const hasil = filterProducts(PRODUCTS, { kategori: 'Wanita' });

    expect(hasil).toHaveLength(3);
    expect(hasil.every((item) => item.kategori === 'Wanita')).toBe(true);
  });

  it('menggabungkan filter kategori dan pencarian (AND)', () => {
    const hasil = filterProducts(PRODUCTS, { kategori: 'Wanita', query: 'songket' });

    expect(hasil.map((item) => item.nama)).toEqual(['Rok Songket Pesta']);
  });

  it('mengurutkan harga menaik dan menurun', () => {
    const menaik = filterProducts(PRODUCTS, { urutan: 'harga-terendah' }).map((item) => item.harga);
    const menurun = filterProducts(PRODUCTS, { urutan: 'harga-tertinggi' }).map((item) => item.harga);

    expect(menaik).toEqual([...menaik].sort((a, b) => a - b));
    expect(menurun).toEqual([...menurun].sort((a, b) => b - a));
  });

  it('mengurutkan nama A–Z dan stok terbanyak', () => {
    const nama = filterProducts(PRODUCTS, { urutan: 'nama-az' }).map((item) => item.nama);
    const stok = filterProducts(PRODUCTS, { urutan: 'stok-terbanyak' }).map((item) => item.stok);

    expect(nama[0]).toBe('Batik Pria Lengan Panjang');
    expect(stok).toEqual([...stok].sort((a, b) => b - a));
  });

  it('tidak mengubah array maupun urutan data masukan', () => {
    const salinan = PRODUCTS.map((item) => ({ ...item }));
    const urutanAwal = PRODUCTS.map((item) => item.id);

    filterProducts(PRODUCTS, { query: 'a', urutan: 'harga-terendah' });

    expect(PRODUCTS.map((item) => item.id)).toEqual(urutanAwal);
    expect(PRODUCTS).toEqual(salinan);
  });

  it('mengembalikan array kosong bila tidak ada yang cocok', () => {
    expect(filterProducts(PRODUCTS, { query: 'zzz' })).toEqual([]);
  });

  it('mengembalikan semua data untuk pencarian kosong', () => {
    expect(filterProducts(PRODUCTS, { query: '   ' })).toHaveLength(PRODUCTS.length);
  });
});

describe('buildWhatsAppUrl', () => {
  const produk = PRODUCTS[0];

  it('membuat tautan wa.me dengan pesan berisi nama dan harga', () => {
    const url = buildWhatsAppUrl('6281234567890', produk);
    const pesan = decodeURIComponent(url.split('text=')[1]);

    expect(url.startsWith('https://wa.me/6281234567890?text=')).toBe(true);
    expect(pesan).toContain(produk.nama);
    expect(pesan).toContain('Rp 450.000');
  });

  it('membersihkan spasi, tanda hubung, titik, dan awalan +', () => {
    const url = buildWhatsAppUrl('+62 812-3456-7890', produk);

    expect(url.startsWith('https://wa.me/6281234567890?text=')).toBe(true);
  });

  it('menolak nomor lokal, terlalu pendek, dan bukan nomor', () => {
    expect(buildWhatsAppUrl('6281234567890', produk)).toBe('');
    expect(buildWhatsAppUrl('0812', produk)).toBe('');
    expect(buildWhatsAppUrl('bukan-nomor', produk)).toBe('');
    expect(buildWhatsAppUrl('', produk)).toBe('');
  });

  it('menolak nomor yang diawali 0 setelah pembersihan', () => {
    expect(buildWhatsAppUrl('+06281234567890', produk)).toBe('');
  });
});
