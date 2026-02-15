import { History, GraduationCap, Banknote, Receipt, TrendingUp } from "lucide-react";

import { formatRupiah } from "../utils/calculator";
import { useState } from "react";

const EducationFundCopy = () => {
  const MAX_BIAYA = 1_000_000_000;

  const [metodeActive, setMetodeActive] = useState("bulan");

  const jenjangOptions = ["SD", "SMP", "SMA", "D1", "D2", "D3", "D4", "S1", "S2", "S3"];

  const [form, setForm] = useState({
    masuk_dalam: "",
    jenjang: "",
    uang_pangkal: "",
    spp: "",
    inflasi: "",
    dana_saat_ini: "",
    metode: "",
  });

  const handleJenjangChange = (e) => {
    setForm((prev) => ({
      ...prev,
      jenjang: e.target.value,
    }));
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    let numeric = Number(value.replace(/\D/g, ""));

    if (name === "uang_pangkal") {
      numeric = Math.min(numeric, MAX_BIAYA);
    }

    if (name === "spp") {
      numeric = Math.min(numeric, MAX_BIAYA);
    }

    if (name === "dana_saat_ini") {
      numeric = Math.min(numeric, MAX_BIAYA);
    }

    setForm((prev) => ({
      ...prev,
      [name]: numeric,
    }));
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
        inflasi: Number(value),
      };
    });
  };

  const handleMetodePembayaran = (value) => {
    setMetodeActive(value);

    setForm((prev) => ({
      ...prev,
      metode: value,
    }));
  };

  const isFormValid =
    form.masuk_dalam !== "" &&
    form.jenjang !== "" &&
    form.uang_pangkal !== "" &&
    form.spp !== "" &&
    form.inflasi !== "" &&
    form.dana_saat_ini !== "";

  const handleButton = () => {
    console.log({ form });
  };
  return (
    <>
      {/* Main container: strict h-screen at lg+, scrollable on mobile */}
      <main className="flex flex-col lg:flex-row items-center min-h-full p-5 lg:py-0 gap-5 bg-gray-200">
        {/* Left Form Section: 3/7 width, internal scroll if needed, compact padding */}
        <section className="border w-full max-w-180 lg:w-3/7 h-full bg-white rounded-xl p-4 sm:p-6 lg:p-10">
          <div className="mb-4 sm:mb-5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 tracking-tight text-center lg:text-start">
              Kalkulator Pendidikan
            </h1>

            <p className={`text-slate-500 text-xs sm:text-sm leading-relaxed tracking-wide text-center lg:text-start`}>
              Rencanakan biaya pendidikan anak secara terstruktur
            </p>
          </div>

          <form className="w-full space-y-5 sm:space-y-6 lg:space-y-8">
            {/* MASUK SEKOLAH DALAM & JENJANG PENDIDIKAN */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                  Jenjang Pendidikan
                </label>

                <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                  <div className="absolute left-3 sm:left-4 text-slate-400">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>

                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <select
                    onChange={handleJenjangChange}
                    className={`w-full bg-transparent border border-slate-200 focus:border-[#2b4eff] rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 ${form.jenjang === "" ? "text-[#868b95]" : "text-slate-900"} font-bold text-base sm:text-lg focus:outline-none transition-colors appearance-none cursor-pointer tracking-tight`}
                  >
                    <option value="">Pilih</option>
                    {jenjangOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                  Masuk sekolah dalam
                </label>

                <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                  <div className="absolute left-3 sm:left-4 text-slate-400">
                    <History className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>

                  <input
                    className="w-full bg-white border border-slate-200 focus:border-[#2b4eff] rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-14 sm:pr-16 text-slate-900 font-bold text-base sm:text-lg focus:outline-none transition-colors"
                    name="masuk_dalam"
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        masuk_dalam: Number(e.target.value),
                      }));
                    }}
                    type="text"
                    inputMode="numeric"
                    placeholder="10"
                    required
                  />

                  <span className="absolute right-2 sm:right-4 text-slate-400 text-xs sm:text-sm font-semibold bg-slate-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    Tahun
                  </span>
                </div>
              </div>
            </div>

            {/* UANG PANGKAL SAAT INI & SPP SAAT INI */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* UANG PANGKAL SAAT INI */}
              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                  Uang Pangkal Saat Ini
                </label>

                <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                  <span className="absolute left-3 text-slate-400 font-semibold sm:border-r sm:borderslate-200 pr-2 sm:pr-3 py-1 text-sm sm:text-base">
                    Rp
                  </span>

                  <input
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-9  md:pl-15 pr-3 sm:pr-4 text-slate-900 font-bold text-sm sm:text-lg focus:outline-none focus:border-[#2b4eff] transition-colors"
                    onChange={handleCurrencyChange}
                    value={form.uang_pangkal ? formatRupiah(form.uang_pangkal) : ""}
                    name="uang_pangkal"
                    type="text"
                    inputMode="numeric"
                    placeholder="20.000.000"
                  />
                </div>
              </div>

              {/* SPP SAAT INI */}
              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                  Biaya SPP Saat Ini
                </label>

                <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                  <span className="absolute left-3 text-slate-400 font-semibold sm:border-r sm:borderslate-200 pr-2 sm:pr-3 py-1 text-sm sm:text-base">
                    Rp
                  </span>

                  <input
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-9  md:pl-15 pr-3 sm:pr-4 text-slate-900 font-bold text-sm sm:text-lg focus:outline-none focus:border-[#2b4eff] transition-colors"
                    onChange={handleCurrencyChange}
                    value={form.spp ? formatRupiah(form.spp) : ""}
                    name="spp"
                    type="text"
                    inputMode="numeric"
                    placeholder="20.000.000"
                  />
                </div>
              </div>
            </div>

            {/* PERIODE PEMBAYARAN */}
            <div className="group">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                Periode Pembayaran SPP
              </label>

              <div className="grid grid-cols-3 py-1 px-1.5 shadow-sm rounded-xl bg-gray-200">
                <div
                  onClick={() => handleMetodePembayaran("bulan")}
                  className={`${metodeActive === "bulan" ? "text-[#2b4eff] bg-white" : "text-[#64748b] hover:text-slate-900"}  px-2 py-3 flex items-center justify-center rounded-lg  text-xs sm:text-sm tracking-tight font-bold cursor-pointer`}
                >
                  Per Bulan
                </div>
                <div
                  onClick={() => handleMetodePembayaran("semester")}
                  className={`${metodeActive === "semester" ? "text-[#2b4eff] bg-white" : "text-[#64748b] hover:text-slate-900"}  px-2 py-3 flex items-center justify-center rounded-lg  text-xs sm:text-sm tracking-tight font-bold cursor-pointer`}
                >
                  Per Semester
                </div>
                <div
                  onClick={() => handleMetodePembayaran("tahun")}
                  className={`${metodeActive === "tahun" ? "text-[#2b4eff] bg-white" : "text-[#64748b] hover:text-slate-900"}  px-2 py-3 flex items-center justify-center rounded-lg  text-xs sm:text-sm tracking-tight font-bold cursor-pointer`}
                >
                  Per Tahun
                </div>
              </div>
            </div>

            {/* INFLASI TAHUNAN & DANA SAAT INI */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                  Inflasi Pendidikan
                </label>

                <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                  <div className="absolute left-3 sm:left-4 text-slate-400">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>

                  <input
                    className="w-full bg-white border border-slate-200 focus:border-[#2b4eff] rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-14 sm:pr-16 text-slate-900 font-bold text-base sm:text-lg focus:outline-none transition-colors"
                    type="text"
                    inputMode="numeric"
                    value={form.inflasi}
                    onChange={handleInflasi}
                    onBlur={validateInflasi}
                    placeholder="5"
                    required
                  />

                  <span className="absolute right-2 sm:right-4 text-slate-400 text-xs sm:text-sm font-semibold bg-slate-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    %
                  </span>
                </div>
              </div>

              {/* SPP SAAT INI */}
              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">Dana Saat Ini</label>

                <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                  <span className="absolute left-3 text-slate-400 font-semibold sm:border-r sm:borderslate-200 pr-2 sm:pr-3 py-1 text-sm sm:text-base">
                    Rp
                  </span>

                  <input
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-9  md:pl-15 pr-3 sm:pr-4 text-slate-900 font-bold text-sm sm:text-lg focus:outline-none focus:border-[#2b4eff] transition-colors"
                    onChange={handleCurrencyChange}
                    value={form.dana_saat_ini ? formatRupiah(form.dana_saat_ini) : ""}
                    name="dana_saat_ini"
                    type="text"
                    inputMode="numeric"
                    placeholder="20.000.000"
                  />
                </div>
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

        {/* Right Results Section: 4/7 width, MUST scroll internally, compact cards */}
        <section className="w-full lg:w-4/7 lg:h-full flex flex-col rounded-xl lg:rounded-none lg:rounded-r-none animate-slide-in lg:overflow-y-auto lg:p-5">
          <div className="w-full space-y-3 lg:space-y-3">
            {/* Hero Target - more compact */}
            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-xl p-5 sm:p-6 lg:p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-2">
                <h3 className="text-slate-500 text-[10px] sm:text-xs lg:text-[10px] font-bold uppercase tracking-widest">
                  Target Dana Pensiun
                </h3>
                <div className="text-[10px] sm:text-xs lg:text-[10px] font-semibold text-[#2b4eff] bg-[#2b4eff]/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  30 Tahun Lagi
                </div>
              </div>

              <div className="flex items-baseline gap-2 sm:gap-3 lg:gap-2">
                <span className="text-lg sm:text-xl lg:text-lg font-bold text-slate-400">Rp</span>
                <span className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                  5.000.000.000
                </span>
              </div>

              <p className="mt-2 sm:mt-3 lg:mt-2 text-xs sm:text-sm lg:text-xs text-slate-500">
                Estimasi kebutuhan total agar biaya pendidikan masa depan tercapai.
              </p>

              <div className="mt-3 sm:mt-4 lg:mt-3">
                <div className="flex justify-between text-[10px] sm:text-xs lg:text-[10px] text-slate-500 mb-1.5 lg:mb-1">
                  <span>Dana Saat Ini</span>
                  <span>20%</span>
                </div>
                <div className="h-2 sm:h-3 lg:h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2b4eff] rounded-full transition-all duration-500"
                    style={{ width: `20%` }}
                  />
                </div>
              </div>
            </div>

            {/* Rincian Kebutuhan & Sisa Target - grid stays, more compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-3">
              <div className="border rounded-xl sm:rounded-2xl lg:rounded-xl p-5 sm:p-6 lg:p-4 bg-white border-slate-100 shadow-sm">
                <h1 className="font-bold text-md sm:text-lg lg:text-sm mb-2 lg:mb-2">Rincian Kebutuhan Masa Depan</h1>

                <div className="flex flex-col gap-2.5 lg:gap-2">
                  <div className="ring-2 ring-slate-300/30 shadow-md px-3 py-2.5 lg:py-2 rounded-xl bg-slate-100">
                    <h1 className="text-xs lg:text-[10px] font-bold tracking-wide text-gray-500">UANG PANGKAL</h1>
                    <p className="text-md lg:text-sm font-extrabold tracking-wide">Rp 56.000.000</p>
                  </div>

                  <div className="ring-2 ring-slate-300/30 shadow-md px-3 py-2.5 lg:py-2 rounded-xl bg-slate-100">
                    <h1 className="text-xs lg:text-[10px] font-bold tracking-wide text-gray-500">TOTAL SPP</h1>
                    <p className="text-md lg:text-sm font-extrabold tracking-wide">Rp 189.000.000</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 lg:mt-2.5">
                  <p className="text-xs lg:text-[10px] text-gray-600">Durasi Pendidikan</p>
                  <p className="text-sm lg:text-xs font-bold">4 Tahun (8 Semester)</p>
                </div>
              </div>

              <div className="border rounded-xl sm:rounded-2xl lg:rounded-xl p-5 sm:p-6 lg:p-4 bg-white border-slate-100 shadow-sm flex flex-col gap-3 sm:gap-4 lg:gap-0 lg:justify-between">
                <div>
                  <h1 className="font-bold text-md sm:text-lg lg:text-sm mb-1 lg:mb-0.5">Sisa Target Dana</h1>
                  <p className="text-xs sm:text-sm lg:text-[10px] text-slate-500 w-8/10 sm:w-full">
                    Jumlah kekurangan yang harus dipenuhi dalam periode investasi.
                  </p>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-xl font-bold">Rp 11.220.000.000</h1>
              </div>
            </div>

            {/* Risk Profile - more compact cards */}
            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-xl p-5 sm:p-6 lg:p-4 shadow-sm border border-slate-100 select-none">
              <h3 className="text-base sm:text-lg lg:text-sm font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-2.5">
                Rekomendasi Tabungan Bulanan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-2.5">
                <div className="border border-slate-200 hover:border-[#2b4eff] rounded-xl p-4 sm:p-5 lg:p-3 shadow-md hover:ring-4 hover:ring-[#2b4eff]/10 transition-all duration-200">
                  <p className="text-[10px] sm:text-xs lg:text-[9px] uppercase tracking-widest text-slate-500 mb-1 sm:mb-2 lg:mb-1">
                    Konservatif
                  </p>

                  <p className="text-base sm:text-lg lg:text-sm font-bold text-slate-900 mb-0.5 sm:mb-1">
                    Rp 5.5jt – 6.6jt
                  </p>

                  <p className="text-[10px] sm:text-xs lg:text-[9px] text-slate-500">Target return 5% – 6% per tahun</p>
                </div>

                <div className="border border-slate-200 hover:border-[#2b4eff] rounded-xl p-4 sm:p-5 lg:p-3 shadow-md hover:ring-4 hover:ring-[#2b4eff]/10 transition-all duration-200">
                  <p className="text-[10px] sm:text-xs lg:text-[9px] uppercase font-extrabold tracking-widest text-[#2b4eff] mb-1 sm:mb-2 lg:mb-1">
                    Moderat (Disarankan)
                  </p>
                  <p className="text-base sm:text-lg lg:text-sm font-bold text-slate-900 mb-0.5 sm:mb-1">
                    Rp 5.5jt – 6.6jt
                  </p>
                  <p className="text-[10px] sm:text-xs lg:text-[9px] text-slate-500">
                    Target return 7% – 10% per tahun
                  </p>
                </div>

                <div className="border border-slate-200 hover:border-[#2b4eff] rounded-xl p-4 sm:p-5 lg:p-3 shadow-md hover:ring-4 hover:ring-[#2b4eff]/10 transition-all duration-200">
                  <p className="text-[10px] sm:text-xs lg:text-[9px] uppercase tracking-widest text-slate-500 mb-1 sm:mb-2 lg:mb-1">
                    Agresif
                  </p>
                  <p className="text-base sm:text-lg lg:text-sm font-bold text-slate-900 mb-0.5 sm:mb-1">
                    Rp 5.5jt – 6.6jt
                  </p>
                  <p className="text-[10px] sm:text-xs lg:text-[9px] text-slate-500">
                    Target return 11% – 15% per tahun
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default EducationFundCopy;
