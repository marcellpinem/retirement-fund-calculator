const danaTerkumpul = document.getElementById("danaTerkumpul");
const usiaSekarang = document.getElementById("usiaSekarang");
const usiaPensiun = document.getElementById("usiaPensiun");
const pengeluaranBulanan = document.getElementById("pengeluaranBulanan");
const inflasi = document.getElementById("inflasi");

const periode = document.getElementById("periode");
const pengeluaranBulananOutput = document.getElementById("pengeluaranBulananOutput");
const targetTabungan = document.getElementById("targetTabungan");
const danaPensiun = document.getElementById("danaPensiun");

function inputRupiah(input) {
  input.addEventListener("input", function () {
    let raw = this.value.replace(/[^0-9]/g, "");
    if (raw) {
      this.value = formatRupiah(raw);
    } else {
      this.value = "";
    }
  });
}

function formatUsia(input) {
  input.addEventListener("input", function () {
    let raw = this.value.replace(/[^0-9]/g, "");
    if (raw) {
      this.value = raw + " tahun";
      this.setSelectionRange(raw.length, raw.length);
      validateUsia();
    } else {
      this.value = "";
    }
  });
}

function validateUsia() {
  const usiaSekarangVal = usiaSekarang.value.replace(/[^0-9]/g, "");
  const usiaPensiunVal = usiaPensiun.value.replace(/[^0-9]/g, "");

  if (usiaSekarangVal !== null && usiaPensiunVal !== null) {
    if (usiaPensiunVal.toString().length >= usiaSekarangVal.toString().length) {
      if (usiaPensiunVal < usiaSekarangVal) {
        alert("Usia pensiun tidak boleh lebih muda dari usia sekarang!");
        usiaPensiun.value = "";
      } else if (usiaPensiunVal === usiaSekarangVal) {
        alert("Usia pensiun tidak boleh sama dengan usia sekarang!");
        usiaPensiun.value = "";
      }
    }
  }
}

function formatRupiah(input) {
  formatted = input
    .toString()
    .split("")
    .reverse()
    .join("")
    .match(/\d{1,3}/g)
    .join(".")
    .split("")
    .reverse()
    .join("");
  return "Rp. " + formatted;
}

function formatInflasi(input) {
  input.addEventListener("input", function () {
    let raw = this.value.replace(/[^0-9]/g, "");
    if (raw) {
      this.value = raw + "%";
      this.setSelectionRange(raw.length, raw.length);
    } else {
      this.value = "";
    }
  });
}

function hitungTabunganBulanan(targetDanaPensiun, annualReturn, tahun) {
  const r = annualReturn / 100;
  const n = tahun;

  const pmt = targetDanaPensiun / ((Math.pow(1 + r, n) - 1) / r);

  return Math.floor(pmt / 12);
}

inputRupiah(danaTerkumpul);
formatUsia(usiaSekarang);
formatUsia(usiaPensiun);
inputRupiah(pengeluaranBulanan);
formatInflasi(inflasi);

function hitungDanaPensiun() {
  const danaTerkumpulVal = danaTerkumpul.value.replace(/[^0-9]/g, "");
  const usiaSekarangVal = usiaSekarang.value.replace(/[^0-9]/g, "");
  const usiaPensiunVal = usiaPensiun.value.replace(/[^0-9]/g, "");
  const pengeluaranBulananVal = pengeluaranBulanan.value.replace(/[^0-9]/g, "");
  const inflasiVal = inflasi.value.replace(/[^0-9]/g, "");

  const periodeVal = usiaPensiunVal - usiaSekarangVal;
  const pengeluaranTahunan = pengeluaranBulananVal * 12;
  const FVpengeluaranTahunan = Math.floor(pengeluaranTahunan * Math.pow(1 + inflasiVal / 100, periodeVal));
  const FVpengeluaranBulanan = Math.floor(FVpengeluaranTahunan / 12);
  const jumlahDanaPensiun = Math.floor(FVpengeluaranTahunan / 0.04);
  const jumlahHarusDitabung = jumlahDanaPensiun - danaTerkumpulVal;

  periode.innerHTML = periodeVal + " tahun";
  pengeluaranBulananOutput.innerHTML = formatRupiah(FVpengeluaranBulanan);
  targetTabungan.innerHTML = formatRupiah(jumlahHarusDitabung);
  danaPensiun.innerHTML = formatRupiah(jumlahDanaPensiun);

  const konservatifMin = document.getElementById("konservatifMin");
  const konservatifMax = document.getElementById("konservatifMax");
  const moderatMin = document.getElementById("moderatMin");
  const moderatMax = document.getElementById("moderatMax");
  const agresifMin = document.getElementById("agresifMin");
  const agresifMax = document.getElementById("agresifMax");

  //   Konservatif
  konservatifMax.innerHTML = formatRupiah(hitungTabunganBulanan(jumlahHarusDitabung, 5, periodeVal));
  konservatifMin.innerHTML = formatRupiah(hitungTabunganBulanan(jumlahHarusDitabung, 6, periodeVal));

  //   Moderat
  moderatMax.innerHTML = formatRupiah(hitungTabunganBulanan(jumlahHarusDitabung, 7, periodeVal));
  moderatMin.innerHTML = formatRupiah(hitungTabunganBulanan(jumlahHarusDitabung, 10, periodeVal));

  //   Agresif
  agresifMax.innerHTML = formatRupiah(hitungTabunganBulanan(jumlahHarusDitabung, 11, periodeVal));
  agresifMin.innerHTML = formatRupiah(hitungTabunganBulanan(jumlahHarusDitabung, 15, periodeVal));
}
