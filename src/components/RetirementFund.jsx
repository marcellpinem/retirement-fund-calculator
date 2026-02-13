import { Banknote, TrendingUp, Umbrella, User, Wallet } from "lucide-react";
import { formatRupiah, formatShort, hitungSelisihUsia, hitungDanaPensiun, hitungProgress } from "../utils/calculator";
import { useState } from "react";

const RetirementFund = () => {
  const MAX_DANA = 100_000_000_000;
  const MAX_PENGELUARAN = 1_000_000_000;
  const MAX_USIA = 100;
  const MIN_USIA = 15;

  const [form, setForm] = useState({
    dana: "",
    pengeluaran: "",
    usiaSekarang: "",
    usiaPensiun: "",
    inflasi: "",
  });

  const [result, setResult] = useState({
    selisihUsia: 30,
    danaPensiun: 4865096250,
    progress: 25,
    sisaTargetDana: 3665096250,
  });

  const [autoFilledPensiun, setAutoFilledPensiun] = useState(true);

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    let numeric = Number(value.replace(/\D/g, ""));

    if (name === "pengeluaran") {
      numeric = Math.min(numeric, MAX_PENGELUARAN);
    }

    if (name === "dana") {
      numeric = Math.min(numeric, MAX_DANA);
    }

    setForm((prev) => ({
      ...prev,
      [name]: numeric,
    }));
  };

  const handleUsiaSekarang = (e) => {
    const raw = e.target.value.replace(/\D/g, "");

    setForm((prev) => {
      let pensiun = prev.usiaPensiun;

      if (autoFilledPensiun && raw !== "") {
        pensiun = String(Number(raw) + 10);
      }

      return {
        ...prev,
        usiaSekarang: raw,
        usiaPensiun: pensiun,
      };
    });
  };

  const validateUsiaSekarang = () => {
    setForm((prev) => {
      if (!prev.usiaSekarang) return prev;

      let usia = Number(prev.usiaSekarang);

      if (usia < MIN_USIA) usia = MIN_USIA;
      if (usia > MAX_USIA) usia = MAX_USIA;

      return {
        ...prev,
        usiaSekarang: String(usia),
      };
    });
  };

  const handleUsiaPensiun = (e) => {
    const raw = e.target.value.replace(/\D/g, "");

    setAutoFilledPensiun(false);

    setForm((prev) => ({
      ...prev,
      usiaPensiun: raw,
    }));
  };

  const validateUsiaPensiun = () => {
    setForm((prev) => {
      if (!prev.usiaPensiun) return prev;

      let pensiun = Number(prev.usiaPensiun);
      const usiaSekarang = Number(prev.usiaSekarang);

      if (pensiun <= usiaSekarang) {
        pensiun = usiaSekarang + 1;
      }

      if (pensiun > MAX_USIA) {
        pensiun = MAX_USIA;
      }

      return {
        ...prev,
        usiaPensiun: String(pensiun),
      };
    });
  };

  const handleInflasi = (e) => {
    const raw = e.target.value.replace(/\D/g, "");

    setForm((prev) => ({
      ...prev,
      inflasi: raw,
    }));
  };

  const validateInflasi = () => {
    setForm((prev) => {
      if (!prev.inflasi) return prev;

      let value = Number(prev.inflasi);

      if (value > 100) value = 100;

      return {
        ...prev,
        inflasi: String(value),
      };
    });
  };

  const isFormValid =
    form.usiaSekarang !== "" &&
    form.usiaPensiun !== "" &&
    form.pengeluaran !== "" &&
    form.dana !== "" &&
    form.inflasi !== "";

  const handleButton = () => {
    const selisih = hitungSelisihUsia(Number(form.usiaSekarang), Number(form.usiaPensiun));

    const dana = hitungDanaPensiun(
      Number(form.usiaSekarang),
      Number(form.usiaPensiun),
      Number(form.inflasi || 0),
      form.pengeluaran,
    );

    const progress = hitungProgress(dana, form.dana);

    const sisaTargetDana = dana - form.dana;

    setResult({
      selisihUsia: selisih,
      danaPensiun: dana,
      progress: progress,
      sisaTargetDana: sisaTargetDana,
    });
  };

  return (
    <>
      <title>Kalkulator Pensiun</title>

      <main className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] bg-gray-50">
        {/* FORM SECTION */}
        <section className="w-full lg:w-1/3 bg-white flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div className="mb-4 sm:mb-5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 tracking-tight text-center md:text-start">
              Kalkulator Dana Pensiun
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed tracking-wide text-center md:text-start">
              Mulai rencanakan kebebasan finansial Anda.
              <span className="hidden sm:inline"> Masukkan data keuangan saat ini untuk simulasi yang akurat.</span>
            </p>
          </div>

          <form className="space-y-5 sm:space-y-6 lg:space-y-8 w-full">
            {/* Dana Pensiun Terkumpul */}
            <div className="group">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                Dana Pensiun Terkumpul
              </label>
              <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                <div className="absolute left-3 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center">
                  <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="absolute left-12 sm:left-16 text-slate-400 font-semibold border-r border-slate-200 pr-2 sm:pr-3 py-1 text-sm sm:text-base">
                  Rp
                </span>

                <input
                  name="dana"
                  type="text"
                  value={form.dana ? formatRupiah(form.dana) : ""}
                  onChange={handleCurrencyChange}
                  placeholder="0"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-20 sm:pl-28 pr-3 sm:pr-4 text-slate-900 font-bold text-base sm:text-lg focus:outline-none focus:border-[#2b4eff] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Usia */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-4">
              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">Usia Sekarang</label>
                <div
                  className={`relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20`}
                >
                  <div className="absolute left-3 sm:left-4 text-slate-400">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <input
                    className={`w-full bg-white border border-slate-200 focus:border-[#2b4eff] rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-14 sm:pr-16 text-slate-900 font-bold text-base sm:text-lg focus:outline-none transition-colors`}
                    type="text"
                    inputMode="numeric"
                    value={form.usiaSekarang}
                    onChange={handleUsiaSekarang}
                    onBlur={validateUsiaSekarang}
                    placeholder="30"
                    required
                  />
                  <span className="absolute right-2 sm:right-4 text-slate-400 text-xs sm:text-sm font-semibold bg-slate-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    Tahun
                  </span>
                </div>
              </div>

              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">Usia Pensiun</label>
                <div
                  className={`relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20`}
                >
                  <div className="absolute left-3 sm:left-4 text-slate-400">
                    <Umbrella className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <input
                    className={`w-full bg-white border border-slate-200 focus:border-[#2b4eff] rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-14 sm:pr-16 text-slate-900 font-bold text-base sm:text-lg focus:outline-none transition-colors`}
                    type="text"
                    inputMode="numeric"
                    value={form.usiaPensiun}
                    onChange={handleUsiaPensiun}
                    onBlur={validateUsiaPensiun}
                    placeholder="55"
                    required
                  />
                  <span className="absolute right-2 sm:right-4 text-slate-400 text-xs sm:text-sm font-semibold bg-slate-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    Tahun
                  </span>
                </div>
              </div>
            </div>

            {/* Pengeluaran Bulanan */}
            <div className="group">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                Pengeluaran Bulanan Saat Ini
              </label>
              <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                <div className="absolute left-3 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center">
                  <Banknote className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="absolute left-12 sm:left-16 text-slate-400 font-semibold border-r border-slate-200 pr-2 sm:pr-3 py-1 text-sm sm:text-base">
                  Rp
                </span>
                <input
                  name="pengeluaran"
                  type="text"
                  value={form.pengeluaran ? formatRupiah(form.pengeluaran) : ""}
                  onChange={handleCurrencyChange}
                  placeholder="5.000.000"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-20 sm:pl-28 pr-3 sm:pr-4 text-slate-900 font-bold text-base sm:text-lg focus:outline-none focus:border-[#2b4eff] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Inflasi */}
            <div className="group">
              <label className="flex justify-between text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                <span>Asumsi Inflasi Tahunan</span>
                <span className="text-[10px] sm:text-xs font-normal text-slate-400 bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded-full">
                  Rata-rata 3-5%
                </span>
              </label>
              <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                <div className="absolute left-3 sm:left-4 text-slate-400">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <input
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 text-slate-900 font-bold text-base sm:text-lg focus:outline-none focus:border-[#2b4eff] transition-colors"
                  type="text"
                  inputMode="numeric"
                  value={form.inflasi}
                  onChange={handleInflasi}
                  onBlur={validateInflasi}
                  placeholder="5"
                  required
                />
                <span className="absolute right-3 sm:right-4 text-slate-400 text-base sm:text-lg font-bold">%</span>
              </div>
            </div>

            <button
              className={`w-full py-2.5 sm:py-3  ${isFormValid ? "bg-[#2b4eff] hover:bg-[#203bbf]" : "bg-gray-400 cursor-not-allowed"} text-white rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-[#2b4eff]/20 transition-all active:scale-[0.98] cursor-pointer`}
              type="button"
              onClick={handleButton}
              disabled={!isFormValid}
            >
              Hitung Sekarang
            </button>
          </form>
        </section>

        {/* RESULTS SECTION */}
        <section className="flex lg:w-2/3 bg-slate-50/50 flex-col p-4 sm:p-5 lg:p-6 overflow-y-auto">
          <div className="w-full space-y-4 sm:space-y-5">
            {/* Hero Target */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                  Target Dana Pensiun
                </h3>
                <div className="text-[10px] sm:text-xs font-semibold text-[#2b4eff] bg-[#2b4eff]/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  {result.selisihUsia} Tahun Lagi
                </div>
              </div>

              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-400">Rp</span>
                <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 leading-none">
                  {formatRupiah(result.danaPensiun)}
                </span>
              </div>

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-500">
                Estimasi kebutuhan total agar gaya hidup tetap terjaga saat pensiun.
              </p>

              <div className="mt-4 sm:mt-6">
                <div className="flex justify-between text-[10px] sm:text-xs text-slate-500 mb-2">
                  <span>Dana Saat Ini</span>
                  <span>{result.progress.toFixed(2)}%</span>
                </div>
                <div className="h-2 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2b4eff]  rounded-full transition-all duration-500"
                    style={{ width: `${result.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Gap Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm border border-slate-100 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">
                  Sisa Target Dana
                </h3>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate">
                  {formatRupiah(result.sisaTargetDana)}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
                  Selisih yang perlu kamu akumulasi dalam {result.selisihUsia} tahun.
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#2b4eff]/10 flex items-center justify-center text-[#2b4eff] shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>

            {/* Risk Profile */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm border border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-6">
                Rekomendasi Tabungan Bulanan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div className="border border-slate-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 mb-1 sm:mb-2">
                    Konservatif
                  </p>

                  <p className="text-base sm:text-lg font-bold text-slate-900 mb-0.5 sm:mb-1">
                    Rp {formatShort(4600000)} – {formatShort(5400000)}
                  </p>

                  <p className="text-[10px] sm:text-xs text-slate-500">Target return 5% – 6% per tahun</p>
                </div>

                <div className="border-2 border-[#2b4eff] rounded-xl p-4 sm:p-5 shadow-md">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#2b4eff] mb-1 sm:mb-2">
                    Moderat (Disarankan)
                  </p>
                  <p className="text-base sm:text-lg font-bold text-slate-900 mb-0.5 sm:mb-1">
                    Rp {formatShort(4600000)} – {formatShort(5400000)}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-500">Target return 7% – 10% per tahun</p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition">
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 mb-1 sm:mb-2">
                    Agresif
                  </p>
                  <p className="text-base sm:text-lg font-bold text-slate-900 mb-0.5 sm:mb-1">
                    Rp {formatShort(4600000)} – {formatShort(5400000)}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-500">Target return 11% – 15% per tahun</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default RetirementFund;
