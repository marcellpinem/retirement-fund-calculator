import { History, GraduationCap, Banknote } from "lucide-react";

import { formatRupiah } from "../utils/calculator";
import { useState } from "react";

const EducationFund = () => {
  const MAX_BIAYA = 1_000_000_000;

  const [form, setForm] = useState({
    masuk_dalam: "",
    jenjang: "",
    uang_pangkal: "",
  });

  const jenjangOptions = ["SD", "SMP", "SMA", "D1", "D2", "D3", "D4", "S1", "S2", "S3"];

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

    if (name === "dana") {
      numeric = Math.min(numeric, MAX_BIAYA);
    }

    setForm((prev) => ({
      ...prev,
      [name]: numeric,
    }));
  };

  return (
    <>
      <main className="flex flex-col lg:flex-row items-center min-h-full p-5 lg:py-0 gap-5 bg-gray-200">
        <section className="border w-full max-w-180 lg:w-1/3 h-full bg-white rounded-xl p-4 sm:p-6 lg:p-10">
          <div className="mb-4 sm:mb-5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 tracking-tight text-center lg:text-start">
              Kalkulator Pendidikan
            </h1>

            <p className={`text-slate-500 text-xs sm:text-sm leading-relaxed tracking-wide text-center lg:text-start`}>
              Rencanakan biaya pendidikan anak secara terstruktur
            </p>
          </div>

          <form className="w-full space-y-5 sm:space-y-6 lg:space-y-8">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
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

              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                  Jenjang Pendidikan
                </label>

                <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                  <div className="absolute left-3 sm:left-4 text-slate-400">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>

                  <select
                    onChange={handleJenjangChange}
                    className={`w-full bg-transparent border border-slate-200 focus:border-[#2b4eff] rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 ${form.jenjang === "" ? "text-[#868b95]" : "text-slate-900"} font-bold text-base sm:text-lg focus:outline-none transition-colors appearance-none cursor-pointer tracking-tight`}
                  >
                    <option value="">Pilih Jenjang</option>
                    {jenjangOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="group">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                Uang Pangkal / Biaya Masuk Saat Ini
              </label>

              <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                <div className="absolute left-3 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center">
                  <Banknote className="" />
                </div>

                <span className="absolute left-12 sm:left-16 text-slate-400 font-semibold border-r borderslate-200 pr-2 sm:pr-3 py-1 text-sm sm:text-base">
                  Rp
                </span>

                <input
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-21 sm:pl-28 pr-3 sm:pr-4 text-slate-900 font-bold text-base sm:text-lg focus:outline-none focus:border-[#2b4eff] transition-colors"
                  onChange={handleCurrencyChange}
                  value={form.uang_pangkal ? formatRupiah(form.uang_pangkal) : ""}
                  name="uang_pangkal"
                  type="text"
                  inputMode="numeric"
                  placeholder="20.000.000"
                />
              </div>
            </div>
          </form>
        </section>
        <section className="border">RESULT</section>
      </main>
    </>
  );
};

export default EducationFund;
