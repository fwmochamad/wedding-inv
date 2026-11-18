# Undangan Fadil & Anisa
1. Edit daftar tamu di `guests.js` (slug -> nama). Link: `https://<domain>/?to=<slug>`
2. Edit tanggal, nomor WA, kuis di bagian atas `public/app.js`; teks (orang tua, alamat, kisah, rekening) di `public/index.html`.
3. Taruh musik di `public/music.mp3` dan foto di `public/img/`.
4. Deploy: push ke GitHub lalu import di vercel.com (Framework: Other), atau `npx vercel --prod`.
Akses tanpa `?to=` atau dengan slug tak terdaftar → 404 (dicek di server via middleware).
