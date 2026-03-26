# RTO UX audit & navigation map

## Halaman utama RTO

**Tidak ada route `/rto` terpisah.** “Beranda RTO” = **Home → tab Rent to Own** (`/home/index?tab=rto`).

| Route | Peran |
|-------|--------|
| `/home/index?tab=rto` | Beranda RTO: program aktif (jika ada), daftar program, ke Jelajahi |
| `/rto-program-explore` | Jelajahi semua program / dealer |
| `/rto-program-explore/operator/:id` | Detail dealer + cabang |
| `/rto-program-explore/bike/:id` | Detail motor program |

## Alur navigasi (diperbaiki)

```
Beranda RTO (?tab=rto)
    → [Lihat semua] → Jelajahi program
    ← [Kembali header / link bawah] ← Jelajahi program

Jelajahi program
    → kartu → Detail operator
    ← [‹] → kembali ke Jelajahi

Detail operator
    → motor → Detail bike
    ← [‹] → Jelajahi program

Detail bike
    ← [‹] → Detail operator (sama dealer)
```

**Sebelumnya:** tombol kembali Jelajahi memakai `navigate(-1)` sehingga bisa mengarah ke halaman non-RTO atau kosong. **Sekarang:** kembali ke **Beranda RTO** (`/home/index?tab=rto`).

## Konstanta (satu sumber)

`src/constants/rtoRoutes.ts`:

- `RTO_HOME_TAB_PATH` — beranda RTO
- `rtoProgramExplorePath()`, `rtoOperatorPath(id)`, `rtoBikePath(id)`

## Home & query `?tab=rto`

- Membuka `/home/index?tab=rto` langsung membuka tab **Rent to Own**.
- Dari Jelajahi → kembali memakai URL ini agar tab benar meski stack history aneh.
- Pindah ke tab lain (Isi Daya / Sewa) menghapus `?tab` dari URL.

## Data program

Home (daftar singkat) dan Jelajahi memakai **`RTO_EXPLORE_OPERATORS`** + urutan jarak yang sama.

## Catatan produk

- RTO explore butuh login (`ProtectedRoute`).
- Bottom nav tidak punya item RTO; akses via tab Rent to Own di Home.
