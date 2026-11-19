import './dashboard.css';
import { KATEGORI } from './products.js';
import { validasiForm } from './validate.js';
import { formatRupiah } from './ui.js';
import { buatJsonEkspor, bacaImporJson } from './store.js';
import {
  getProduk,
  subscribe,
  tambahProduk,
  ubahProduk,
  hapusProduk,
  gantiSemua,
  muatUlangContoh,
} from './state.js';

const ID_INPUT = {
  nama: 'f-nama',
  kategori: 'f-kategori',
  harga: 'f-harga',
  stok: 'f-stok',
  deskripsi: 'f-deskripsi',
  imageUrl: 'f-gambar',
};

let timerToast = null;

/** Tampilkan notifikasi singkat di pojok layar. */
export function tampilkanToast(pesan, jenis = 'sukses') {
  const toast = document.querySelector('#toast');
  if (!toast) return;

  clearTimeout(timerToast);
  toast.textContent = pesan;
  toast.dataset.jenis = jenis;
  toast.hidden = false;

  timerToast = setTimeout(() => {
    toast.hidden = true;
    toast.textContent = '';
  }, 4000);
}

export function inisialisasiDashboard() {
  const form = document.querySelector('#form-produk');
  if (!form) return;

  const judulForm = document.querySelector('#judul-form');
  const tombolSimpan = document.querySelector('#tombol-simpan');
  const tombolBatal = document.querySelector('#tombol-batal');
  const tombolEkspor = document.querySelector('#tombol-ekspor');
  const tombolImpor = document.querySelector('#tombol-impor');
  const inputImpor = document.querySelector('#input-impor');
  const tombolReset = document.querySelector('#tombol-reset');
  const tabelBody = document.querySelector('#tabel-produk');
  const tabelKosong = document.querySelector('#tabel-kosong');
  const tabelWrap = document.querySelector('.table-wrap');
  const elTotal = document.querySelector('#ringkasan-total');
  const elStok = document.querySelector('#ringkasan-stok');
  const elHabis = document.querySelector('#ringkasan-habis');
  const elKategori = document.querySelector('#ringkasan-kategori');

  const fNama = document.querySelector('#f-nama');
  const fKategori = document.querySelector('#f-kategori');
  const fHarga = document.querySelector('#f-harga');
  const fStok = document.querySelector('#f-stok');
  const fDeskripsi = document.querySelector('#f-deskripsi');
  const fGambar = document.querySelector('#f-gambar');
  const fUnggulan = document.querySelector('#f-unggulan');

  const dialog = document.querySelector('#dialog-konfirmasi');
  const dialogJudul = document.querySelector('#dialog-judul');
  const dialogPesan = document.querySelector('#dialog-pesan');
  const dialogYa = document.querySelector('#dialog-ya');

  let idSunting = null;
  let selesaikanDialog = null;

  // ---------- Pilihan kategori ----------
  fKategori.replaceChildren();
  for (const nama of KATEGORI) {
    const opsi = document.createElement('option');
    opsi.value = nama;
    opsi.textContent = nama;
    fKategori.append(opsi);
  }

  // ---------- Dialog konfirmasi ----------
  function konfirmasi({ judul, pesan, labelYa = 'Lanjutkan' }) {
    if (!dialog || typeof dialog.showModal !== 'function') {
      return Promise.resolve(window.confirm(`${judul}\n\n${pesan}`));
    }

    dialogJudul.textContent = judul;
    dialogPesan.textContent = pesan;
    dialogYa.textContent = labelYa;
    dialog.returnValue = 'batal';

    return new Promise((resolve) => {
      selesaikanDialog = resolve;
      dialog.showModal();
    });
  }

  dialog?.addEventListener('close', () => {
    if (!selesaikanDialog) return;
    const disetujui = dialog.returnValue === 'ya';
    selesaikanDialog(disetujui);
    selesaikanDialog = null;
  });

  // ---------- Validasi tampilan ----------
  function bersihkanGalat() {
    for (const el of form.querySelectorAll('[data-galat]')) el.textContent = '';
    for (const id of Object.values(ID_INPUT)) {
      document.querySelector(`#${id}`)?.removeAttribute('aria-invalid');
    }
  }

  function tampilkanGalat(errors) {
    bersihkanGalat();

    for (const [field, pesan] of Object.entries(errors)) {
      const el = document.querySelector(`[data-galat="${field}"]`);
      if (el) el.textContent = pesan;

      const input = document.querySelector(`#${ID_INPUT[field]}`);
      if (input) input.setAttribute('aria-invalid', 'true');
    }

    const pertama = Object.keys(errors)[0];
    document.querySelector(`#${ID_INPUT[pertama]}`)?.focus();
  }

  function bacaForm() {
    return {
      nama: fNama.value,
      kategori: fKategori.value,
      harga: fHarga.value,
      stok: fStok.value,
      deskripsi: fDeskripsi.value,
      imageUrl: fGambar.value,
      unggulan: fUnggulan.checked,
    };
  }

  function aturModeTambah() {
    idSunting = null;
    form.reset();
    fKategori.value = KATEGORI[0];
    judulForm.textContent = 'Tambah layanan';
    tombolSimpan.textContent = 'Simpan layanan';
    tombolBatal.hidden = true;
    bersihkanGalat();
  }

  function aturModeUbah(produk) {
    idSunting = produk.id;
    fNama.value = produk.nama;
    fKategori.value = produk.kategori;
    fHarga.value = String(produk.harga);
    fStok.value = String(produk.stok);
    fDeskripsi.value = produk.deskripsi;
    fGambar.value = produk.imageUrl;
    fUnggulan.checked = produk.unggulan;
    judulForm.textContent = 'Ubah layanan';
    tombolSimpan.textContent = 'Simpan perubahan';
    tombolBatal.hidden = false;
    bersihkanGalat();
    fNama.focus();
    judulForm.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  // ---------- Ringkasan ----------
  function renderRingkasan(daftar) {
    const totalStok = daftar.reduce((jumlah, item) => jumlah + item.stok, 0);
    const habis = daftar.filter((item) => item.stok === 0).length;
    const kategori = new Set(daftar.map((item) => item.kategori));

    elTotal.textContent = String(daftar.length);
    elStok.textContent = String(totalStok);
    elHabis.textContent = String(habis);
    elKategori.textContent = String(kategori.size);
  }

  // ---------- Tabel ----------
  function sel(teks, kelas) {
    const td = document.createElement('td');
    if (kelas) td.className = kelas;
    td.textContent = teks;
    td.dataset.label = '';
    return td;
  }

  function renderTabel(daftar) {
    tabelBody.replaceChildren();

    const adaData = daftar.length > 0;
    tabelWrap.hidden = !adaData;
    tabelKosong.hidden = adaData;

    for (const produk of daftar) {
      const baris = document.createElement('tr');

      const tdNama = sel(produk.nama);
      tdNama.dataset.label = 'Nama';
      tdNama.className = 'cell-nama';

      const tdKategori = sel(produk.kategori);
      tdKategori.dataset.label = 'Kategori';

      const tdHarga = sel(formatRupiah(produk.harga));
      tdHarga.dataset.label = 'Harga';

      const tdStok = sel(produk.stok === 0 ? 'Habis (0)' : String(produk.stok));
      tdStok.dataset.label = 'Stok';
      if (produk.stok === 0) tdStok.classList.add('is-out');

      const tdUnggulan = sel(produk.unggulan ? 'Ya' : 'Tidak');
      tdUnggulan.dataset.label = 'Unggulan';

      const tdAksi = document.createElement('td');
      tdAksi.className = 'cell-aksi';
      tdAksi.dataset.label = 'Aksi';

      const ubah = document.createElement('button');
      ubah.type = 'button';
      ubah.className = 'btn btn-small btn-secondary';
      ubah.dataset.aksi = 'ubah';
      ubah.dataset.id = produk.id;
      ubah.textContent = 'Ubah';
      ubah.setAttribute('aria-label', `Ubah layanan ${produk.nama}`);

      const hapus = document.createElement('button');
      hapus.type = 'button';
      hapus.className = 'btn btn-small btn-outline-danger';
      hapus.dataset.aksi = 'hapus';
      hapus.dataset.id = produk.id;
      hapus.textContent = 'Hapus';
      hapus.setAttribute('aria-label', `Hapus layanan ${produk.nama}`);

      tdAksi.append(ubah, hapus);

      baris.append(tdNama, tdKategori, tdHarga, tdStok, tdUnggulan, tdAksi);
      tabelBody.append(baris);
    }
  }

  function render() {
    const daftar = getProduk();
    renderRingkasan(daftar);
    renderTabel(daftar);

    // Bila layanan yang sedang diubah sudah tidak ada (mis. impor/reset).
    if (idSunting && !daftar.some((item) => item.id === idSunting)) aturModeTambah();
  }

  // ---------- Aksi data ----------
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const cek = validasiForm(bacaForm());
    if (!cek.ok) {
      tampilkanGalat(cek.errors);
      tampilkanToast('Periksa kembali isian form.', 'galat');
      return;
    }

    bersihkanGalat();
    const sedangUbah = idSunting !== null;
    const hasil = sedangUbah ? ubahProduk(idSunting, cek.data) : tambahProduk(cek.data);

    if (!hasil.ok) {
      tampilkanToast(hasil.pesan, 'galat');
      return;
    }

    tampilkanToast(
      sedangUbah ? 'Perubahan layanan disimpan.' : 'Layanan baru ditambahkan.',
    );
    aturModeTambah();
  });

  tombolBatal.addEventListener('click', () => {
    aturModeTambah();
    tampilkanToast('Perubahan dibatalkan.');
  });

  tabelBody.addEventListener('click', async (event) => {
    const tombol = event.target.closest('button[data-aksi]');
    if (!tombol) return;

    const daftar = getProduk();
    const produk = daftar.find((item) => item.id === tombol.dataset.id);
    if (!produk) {
      tampilkanToast('Layanan tidak ditemukan. Tabel sudah diperbarui.', 'galat');
      return;
    }

    if (tombol.dataset.aksi === 'ubah') {
      aturModeUbah(produk);
      return;
    }

    if (tombol.dataset.aksi !== 'hapus') return;

    const disetujui = await konfirmasi({
      judul: 'Hapus layanan?',
      pesan: `"${produk.nama}" akan dihapus dari dashboard dan katalog publik.`,
      labelYa: 'Hapus',
    });
    if (!disetujui) return;

    const hasil = hapusProduk(produk.id);
    if (!hasil.ok) {
      tampilkanToast(hasil.pesan, 'galat');
      return;
    }

    if (idSunting === produk.id) aturModeTambah();
    tampilkanToast(`"${produk.nama}" dihapus.`);
  });

  // ---------- Ekspor / impor ----------
  tombolEkspor.addEventListener('click', () => {
    const daftar = getProduk();
    const blob = new Blob([buatJsonEkspor(daftar)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const tanggal = new Date().toISOString().slice(0, 10);

    const tautan = document.createElement('a');
    tautan.href = url;
    tautan.download = `jahitsuka-produk-${tanggal}.json`;
    document.body.append(tautan);
    tautan.click();
    tautan.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    tampilkanToast(`Ekspor ${daftar.length} layanan dimulai.`);
  });

  tombolImpor.addEventListener('click', () => inputImpor.click());

  inputImpor.addEventListener('change', async () => {
    const berkas = inputImpor.files?.[0];
    inputImpor.value = '';
    if (!berkas) return;

    let teks;
    try {
      teks = await berkas.text();
    } catch {
      tampilkanToast('Berkas tidak dapat dibaca.', 'galat');
      return;
    }

    const cek = bacaImporJson(teks);
    if (!cek.ok) {
      tampilkanToast(`Impor dibatalkan: ${cek.pesan}`, 'galat');
      return;
    }

    const hasil = gantiSemua(cek.produk);
    if (!hasil.ok) {
      tampilkanToast(hasil.pesan, 'galat');
      return;
    }

    aturModeTambah();
    tampilkanToast(`Impor berhasil: ${cek.produk.length} layanan dimuat.`);
  });

  tombolReset.addEventListener('click', async () => {
    const disetujui = await konfirmasi({
      judul: 'Muat ulang data contoh?',
      pesan: 'Delapan layanan contoh akan menggantikan seluruh data saat ini.',
      labelYa: 'Muat ulang',
    });
    if (!disetujui) return;

    const hasil = muatUlangContoh();
    if (!hasil.ok) {
      tampilkanToast(hasil.pesan, 'galat');
      return;
    }

    aturModeTambah();
    tampilkanToast('Delapan data contoh dimuat kembali.');
  });

  subscribe(render);
  aturModeTambah();
  render();
}
