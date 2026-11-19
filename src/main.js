import './style.css';
import { WA_NOMOR } from './products.js';
import { STORAGE_KEY } from './store.js';
import { getProduk, subscribe, statusAwal, perbaruiDariStorage } from './state.js';
import { filterProducts, renderKatalog, renderOpsiKategori } from './ui.js';
import { inisialisasiDashboard, tampilkanToast } from './dashboard.js';

const tampilanKatalog = document.querySelector('#tampilan-katalog');
const tampilanDashboard = document.querySelector('#tampilan-dashboard');
const tabKatalog = document.querySelector('#tab-katalog');
const tabDashboard = document.querySelector('#tab-dashboard');
const peringatanData = document.querySelector('#peringatan-data');

const inputCari = document.querySelector('#input-cari');
const filterKategori = document.querySelector('#filter-kategori');
const urutkan = document.querySelector('#urutkan');
const grid = document.querySelector('#daftar-produk');
const jumlahHasil = document.querySelector('#jumlah-hasil');

// ---------- Navigasi tab Katalog / Dashboard ----------
let modeSebelumnya = null;

/** @returns {boolean} true bila berpindah antara Katalog dan Dashboard. */
function tampilkanTampilan() {
  const dashboardAktif = window.location.hash === '#dashboard';
  const berubahMode = modeSebelumnya !== null && modeSebelumnya !== dashboardAktif;

  if (tampilanKatalog) tampilanKatalog.hidden = dashboardAktif;
  if (tampilanDashboard) tampilanDashboard.hidden = !dashboardAktif;

  tabKatalog?.classList.toggle('is-active', !dashboardAktif);
  tabDashboard?.classList.toggle('is-active', dashboardAktif);

  if (dashboardAktif) {
    tabDashboard?.setAttribute('aria-current', 'page');
    tabKatalog?.removeAttribute('aria-current');
    document.title = 'JahitSuka — Dashboard Pengelola';
  } else {
    tabKatalog?.setAttribute('aria-current', 'page');
    tabDashboard?.removeAttribute('aria-current');
    document.title = 'JahitSuka — Katalog Layanan Jahit';
  }

  modeSebelumnya = dashboardAktif;
  return berubahMode;
}

window.addEventListener('hashchange', () => {
  const berubahMode = tampilkanTampilan();
  // Jangan menggulir ulang saat pengguna menuju anchor di halaman yang sama.
  if (berubahMode) window.scrollTo({ top: 0, behavior: 'auto' });
});

// ---------- Pemberitahuan data localStorage ----------
if (peringatanData) {
  if (statusAwal.pesan) {
    peringatanData.textContent = statusAwal.pesan;
    peringatanData.hidden = false;
  } else {
    peringatanData.hidden = true;
  }
}

// ---------- Katalog publik ----------
if (filterKategori) renderOpsiKategori(filterKategori);

function bacaKontrol() {
  return {
    query: inputCari?.value ?? '',
    kategori: filterKategori?.value ?? 'Semua kategori',
    urutan: urutkan?.value ?? 'unggulan',
  };
}

function adaFilterAktif({ query, kategori, urutan }) {
  return query.trim() !== '' || kategori !== 'Semua kategori' || urutan !== 'unggulan';
}

function bersihkanPencarian() {
  if (inputCari) inputCari.value = '';
  if (filterKategori) filterKategori.value = 'Semua kategori';
  if (urutkan) urutkan.value = 'unggulan';
  render();
  inputCari?.focus();
}

function render() {
  if (!grid) return;

  const kontrol = bacaKontrol();
  const daftar = getProduk();

  renderKatalog({
    wadah: grid,
    daftar: filterProducts(daftar, kontrol),
    jumlahEl: jumlahHasil,
    totalSemua: daftar.length,
    adaFilter: adaFilterAktif(kontrol),
    waNomor: WA_NOMOR,
    onBersihkan: bersihkanPencarian,
  });
}

inputCari?.addEventListener('input', render);
filterKategori?.addEventListener('change', render);
urutkan?.addEventListener('change', render);

// ---------- Sinkronisasi antar-tab peramban ----------
window.addEventListener('storage', (event) => {
  if (event.key !== null && event.key !== STORAGE_KEY) return;

  const hasil = perbaruiDariStorage();
  if (hasil.status === 'rusak') tampilkanToast(hasil.pesan, 'galat');
});

// ---------- Mulai ----------
inisialisasiDashboard();
subscribe(render);
render();
tampilkanTampilan();
