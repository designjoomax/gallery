// ===========================================================================
// KONFIGURASI GALLERY JOOMAX: semua album diatur dari sini.
//
// Menambah album:
//   1. Buat folder  assets/albums/<id>/  lalu taruh foto di dalamnya.
//   2. Tambah satu blok album di bawah. "id" = nama folder = alamat album
//      (https://designjoomax.github.io/gallery/#<id>).
//
// photos : daftar nama file di folder album. Boleh teks biasa ("foto1.jpg")
//          atau { src: "foto2.jpg", caption: "Keterangan foto" }.
//          Path penuh (https://... atau assets/...) juga boleh.
// cover  : gambar sampul. Kosong = pakai foto pertama. Kalau belum ada foto = placeholder.
// category: dipakai untuk tombol filter di atas daftar album.
//
// id album yang tampil di Home (Latest Memories) harus sama dengan id di sini.
// ===========================================================================
window.JOOMAX_GALLERY = {
  title: "Dokumentasi Kegiatan",
  subtitle: "Momen dan dokumentasi kegiatan Joomax Teknologi Indonesia.",

  albums: [
    { id: "liburland",        title: "Liburland",        date: "2026-10-12", category: "Kegiatan", cover: "", desc: "", photos: [] },
    { id: "ulang-tahun",      title: "Ulang Tahun",      date: "2026-10-05", category: "Perayaan", cover: "", desc: "", photos: [] },
    { id: "buka-bersama",     title: "Buka Bersama",     date: "2026-09-27", category: "Kegiatan", cover: "", desc: "", photos: [] },
    { id: "hari-kemerdekaan", title: "Hari kemerdekaan", date: "2026-08-17", category: "Perayaan", cover: "", desc: "", photos: [] },
    { id: "rapat-tahunan",    title: "Rapat tahunan",    date: "2026-08-02", category: "Meeting",  cover: "", desc: "", photos: [] }
  ]
};
