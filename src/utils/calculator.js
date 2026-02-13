// Format full rupiah (5.000.000)
export const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  }).format(value);

// Format short (2.2jt, 836rb) pembulatan ke atas
export const formatShort = (value) => {
  if (value >= 1_000_000_000) {
    return Math.ceil(value / 1_000_000_000) + "M";
  }

  if (value >= 1_000_000) {
    return (Math.ceil((value / 1_000_000) * 10) / 10).toFixed(1).replace(".0", "") + "jt";
  }

  if (value >= 1_000) {
    return Math.ceil(value / 1_000) + "rb";
  }

  return value.toString();
};

export const hitungSelisihUsia = (usiaSekarang, usiaPensiun) => {
  return usiaPensiun - usiaSekarang;
};

export const hitungDanaPensiun = (usiaSekarang, usiaPensiun, inflasi, pengeluaranBulanan) => {
  const selisihUsia = usiaPensiun - usiaSekarang;
  const pengeluaranTahunan = pengeluaranBulanan * 12;
  const FVpengeluaranTahunan = Math.floor(pengeluaranTahunan * Math.pow(1 + inflasi / 100, selisihUsia));

  return FVpengeluaranTahunan / 0.04;
};

export const hitungProgress = (danaPensiun, tabunganSaatIni) => {
  return (tabunganSaatIni / danaPensiun) * 100;
};

export function hitungTabunganBulanan(targetDanaPensiun, annualReturn, tahun) {
  const r = annualReturn / 100;
  const n = tahun;

  const pmt = targetDanaPensiun / ((Math.pow(1 + r, n) - 1) / r);

  return Math.floor(pmt / 12);
}
