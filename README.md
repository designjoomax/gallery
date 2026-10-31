# Gallery Joomax

Halaman dokumentasi kegiatan: daftar album, filter kategori, pencarian, isi album, dan lightbox (keyboard + swipe).
Live: https://designjoomax.github.io/gallery/

Header dan footer dimuat dari repo `headerfooter`. Tema sama dengan Home.

## Struktur
```
index.html
css/gallery.css
js/gallery.config.js   daftar album (edit di sini)
js/gallery.js          logika
assets/
  albums/<id>/         foto per album
  icon/icon.png        favicon
```

## Menambah album
1. Buat folder `assets/albums/<id>/` (contoh `assets/albums/outing-2026/`) dan taruh foto di dalamnya.
2. Tambah satu blok di `js/gallery.config.js`:
```js
{ id: "outing-2026", title: "Outing 2026", date: "2026-11-20", category: "Kegiatan",
  desc: "Keterangan singkat (opsional).",
  photos: ["1.jpg", { src: "2.jpg", caption: "Keterangan foto" }, "3.jpg"] }
```
- `id` = nama folder = alamat album (`.../gallery/#outing-2026`).
- `cover` (opsional): gambar sampul. Kosong = pakai foto pertama.
- `category` dipakai untuk tombol filter. Tombol muncul otomatis kalau ada 2 kategori atau lebih.
- Album diurutkan otomatis dari tanggal terbaru.

Saran foto: lebar 1600 px, JPG/WebP, di bawah 400 KB per foto.

## Terhubung dengan Home
Bagian Latest Memories di Home memakai `id` yang sama (`js/home.config.js` di repo `home`). Klik foto di Home langsung membuka albumnya di sini. Kalau menambah album baru dan ingin tampil di Home, tambahkan juga di `gallery.items` Home dengan `id` yang sama.

## Deploy (GitHub Pages)
Upload isi folder ini ke root repo `gallery`, lalu Settings > Pages > Deploy from branch > `main` / `(root)`.
Catatan: folder kosong tidak ikut ter-upload ke GitHub, jadi `assets/albums/` baru muncul setelah ada fotonya.
