import type { Application } from "../types/rtoApplication";

export interface PickupDocReminder {
  icon: string;
  title: string;
  detail?: string;
}

/** Ringkasan dokumen fisik yang sebaiknya dibawa saat handover (katalog publik tidak menggantikan arahan dealer). */
export function getPickupDocumentReminders(app: Application): PickupDocReminder[] {
  const lines: PickupDocReminder[] = [
    {
      icon: "🪪",
      title: "KTP asli pemohon",
      detail: "Nama harus cocok dengan pengajuan",
    },
    {
      icon: "🏍️",
      title: "SIM C asli",
      detail: "Masih berlaku sesuai berkas",
    },
    {
      icon: "🤳",
      title: "Selfie memuat KTP",
      detail: "Bawa HP; siapkan ulang jika diminta verifikasi",
    },
    {
      icon: "💵",
      title: "Bukti penghasilan / slip gaji",
      detail: "Asli atau cetak terbaru bila dealer minta",
    },
  ];

  if (app.form.guarantorType !== "none") {
    lines.push(
      {
        icon: "🪪",
        title: "KTP asli penjamin",
        detail: "Orang yang tercantum di data penjamin",
      },
      {
        icon: "📊",
        title: "Bukti penghasilan penjamin",
        detail: "Slip gaji / rekening bisnis penjamin",
      },
    );
  }

  lines.push({
    icon: "📎",
    title: "Lainnya dari chat / status",
    detail:
      "KK, surat keterangan kerja, atau STNK kendaraan lama jika pernah diminta di pengajuan",
  });

  return lines;
}
