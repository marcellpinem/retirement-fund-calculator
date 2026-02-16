import { History, GraduationCap, TrendingUp } from "lucide-react";
import {
  formatRupiah,
  formatShort,
  hitungFVUangPangkal,
  hitungTotalSPP,
  hitungTabunganBulanan,
  hitungProgress,
} from "../utils/calculator";
import { useState } from "react";

const EducationFund = () => {
  const MAX_AMOUNT = 1_000_000_000;
  const EDUCATION_LEVELS = ["SD", "SMP", "SMA", "D1", "D2", "D3", "D4", "S1", "S2", "S3"];
  const PERIOD_OPTIONS = ["bulan", "semester", "tahun"];
  const EDUCATION_DURATION = {
    SD: 6,
    SMP: 3,
    SMA: 3,
    D1: 1,
    D2: 2,
    D3: 3,
    D4: 4,
    S1: 4,
    S2: 2,
    S3: 3,
  };

  const [formData, setFormData] = useState({
    yearsUntilEnrollment: "",
    educationLevel: "",
    enrollmentFee: "",
    tuitionFee: "",
    inflationRate: "",
    currentFunds: "",
    paymentPeriod: "bulan",
  });

  const [calculationResult, setCalculationResult] = useState(null);

  const handleEducationLevelChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      educationLevel: e.target.value,
    }));
  };

  const handlePeriodChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      paymentPeriod: e.target.value,
    }));
  };

  const handleCurrencyInput = (e) => {
    const { name, value } = e.target;
    const numericValue = Math.min(Number(value.replace(/\D/g, "")), MAX_AMOUNT);

    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handleInflationInput = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");

    setFormData((prev) => ({
      ...prev,
      inflationRate: numericValue,
    }));
  };

  const validateInflation = () => {
    setFormData((prev) => {
      if (!prev.inflationRate) return prev;

      const validatedValue = Math.min(Number(prev.inflationRate), 100);

      return {
        ...prev,
        inflationRate: validatedValue,
      };
    });
  };

  const isFormComplete =
    formData.yearsUntilEnrollment !== "" &&
    formData.educationLevel !== "" &&
    formData.enrollmentFee !== "" &&
    formData.tuitionFee !== "" &&
    formData.inflationRate !== "" &&
    formData.currentFunds !== "";

  const calculateEducationFund = () => {
    const durationInYears = EDUCATION_DURATION[formData.educationLevel] || 0;
    const futureEnrollmentFee = hitungFVUangPangkal(
      formData.yearsUntilEnrollment,
      formData.enrollmentFee,
      formData.inflationRate,
    );
    const totalTuitionCost = hitungTotalSPP(
      formData.tuitionFee,
      formData.inflationRate,
      formData.yearsUntilEnrollment,
      durationInYears,
      formData.paymentPeriod,
    );
    const totalRequiredFunds = futureEnrollmentFee + totalTuitionCost;
    const remainingFundsNeeded = Math.max(0, totalRequiredFunds - formData.currentFunds);
    const fundingProgress = hitungProgress(totalRequiredFunds, formData.currentFunds);

    setCalculationResult({
      currentFunds: formData.currentFunds,
      enrollmentFee: futureEnrollmentFee,
      totalTuition: totalTuitionCost,
      remainingFunds: remainingFundsNeeded,
      educationDuration: durationInYears,
      yearsToEnrollment: formData.yearsUntilEnrollment,
      progressPercentage: fundingProgress,
      conservativeLow: hitungTabunganBulanan(remainingFundsNeeded, 5, formData.yearsUntilEnrollment),
      conservativeHigh: hitungTabunganBulanan(remainingFundsNeeded, 6, formData.yearsUntilEnrollment),
      moderateLow: hitungTabunganBulanan(remainingFundsNeeded, 7, formData.yearsUntilEnrollment),
      moderateHigh: hitungTabunganBulanan(remainingFundsNeeded, 10, formData.yearsUntilEnrollment),
      aggressiveLow: hitungTabunganBulanan(remainingFundsNeeded, 11, formData.yearsUntilEnrollment),
      aggressiveHigh: hitungTabunganBulanan(remainingFundsNeeded, 15, formData.yearsUntilEnrollment),
    });
  };

  return (
    <>
      <title>Kalkulator Pendidikan</title>

      <main
        className={`min-h-full bg-gray-200 overflow-hidden flex flex-col lg:flex-row  ${calculationResult ? "" : "lg:justify-center"} gap-0 lg:gap-5`}
      >
        {/* Form Section */}
        <section className="p-5 lg:pr-0 w-full lg:w-3/8 flex justify-center">
          <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-10 max-w-180 flex flex-col">
            {/* Form Header */}
            <div className="mb-4 sm:mb-5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1 lg:mb-2 tracking-tight text-center lg:text-start">
                Kalkulator Pendidikan
              </h1>

              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed tracking-wide text-center lg:text-start">
                Rencanakan biaya pendidikan anak sekarang!
              </p>
            </div>

            <form className="flex flex-col flex-1 space-y-5 sm:space-y-6 lg:space-y-8 justify-center xl:justify-start">
              {/* Jenjang Pendidikan & Mulai Pendidikan dalam */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Jenjang Pendidikan */}
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
                      onChange={handleEducationLevelChange}
                      className={`w-full bg-transparent border border-slate-200 focus:border-[#2b4eff] rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 ${formData.educationLevel === "" ? "text-[#868b95]" : "text-slate-900"} font-bold text-base sm:text-lg focus:outline-none transition-colors appearance-none cursor-pointer tracking-tight`}
                    >
                      <option value="">Pilih</option>
                      {EDUCATION_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mulai Pendidikan dalam */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                    Mulai Pendidikan dalam
                  </label>

                  <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                    <div className="absolute left-3 sm:left-4 text-slate-400">
                      <History className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>

                    <input
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-12 sm:pr-16 text-slate-900 font-bold text-base sm:text-lg focus:outline-none focus:border-[#2b4eff] transition-colors"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          yearsUntilEnrollment: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                      value={formData.yearsUntilEnrollment}
                      type="text"
                      inputMode="numeric"
                      placeholder="15"
                    />

                    <span className="absolute right-3 sm:right-4 text-slate-400 text-xs sm:text-sm font-semibold bg-slate-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                      tahun
                    </span>
                  </div>
                </div>
              </div>

              {/* Uang Pangkal & SPP per Periode */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Uang Pangkal */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">Uang Pangkal</label>

                  <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                    <span className="absolute left-3 text-slate-400 font-semibold sm:border-r sm:borderslate-200 pr-2 sm:pr-3 py-1 text-sm sm:text-base">
                      Rp
                    </span>

                    <input
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-9  md:pl-15 pr-3 sm:pr-4 text-slate-900 font-bold text-sm sm:text-lg focus:outline-none focus:border-[#2b4eff] transition-colors"
                      onChange={handleCurrencyInput}
                      value={formData.enrollmentFee ? formatRupiah(formData.enrollmentFee) : ""}
                      name="enrollmentFee"
                      type="text"
                      inputMode="numeric"
                      placeholder="50.000.000"
                    />
                  </div>
                </div>

                {/* SPP per Periode */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                    SPP per Periode
                  </label>

                  <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                    <span className="absolute left-3 text-slate-400 font-semibold sm:border-r sm:borderslate-200 pr-2 sm:pr-3 py-1 text-sm sm:text-base">
                      Rp
                    </span>

                    <input
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-9  md:pl-15 pr-3 sm:pr-4 text-slate-900 font-bold text-sm sm:text-lg focus:outline-none focus:border-[#2b4eff] transition-colors"
                      onChange={handleCurrencyInput}
                      value={formData.tuitionFee ? formatRupiah(formData.tuitionFee) : ""}
                      name="tuitionFee"
                      type="text"
                      inputMode="numeric"
                      placeholder="5.000.000"
                    />
                  </div>
                </div>
              </div>

              {/* Periode Pembayaran */}
              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                  Periode Pembayaran SPP
                </label>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {PERIOD_OPTIONS.map((period) => (
                    <label
                      key={period}
                      className={`relative flex items-center justify-center p-2.5 sm:p-3 rounded-xl border-2 ${
                        formData.paymentPeriod === period
                          ? "border-[#2b4eff] bg-[#2b4eff]/5"
                          : "border-slate-200 bg-white"
                      } cursor-pointer hover:border-[#2b4eff]/50 transition-all shadow-sm hover:shadow-md`}
                    >
                      <input
                        type="radio"
                        name="paymentPeriod"
                        value={period}
                        checked={formData.paymentPeriod === period}
                        onChange={handlePeriodChange}
                        className="sr-only"
                      />
                      <span
                        className={`text-xs sm:text-sm font-bold capitalize ${
                          formData.paymentPeriod === period ? "text-[#2b4eff]" : "text-slate-600"
                        }`}
                      >
                        {period}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Inflasi & Dana Saat Ini */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Inflasi */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                    Inflasi Tahunan
                  </label>

                  <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                    <div className="absolute left-3 sm:left-4 text-slate-400">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>

                    <input
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 text-slate-900 font-bold text-base sm:text-lg focus:outline-none focus:border-[#2b4eff] transition-colors"
                      onChange={handleInflationInput}
                      onBlur={validateInflation}
                      value={formData.inflationRate}
                      type="text"
                      inputMode="numeric"
                      placeholder="10"
                    />

                    <span className="absolute right-2 sm:right-4 text-slate-400 text-xs sm:text-sm font-semibold bg-slate-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                      %
                    </span>
                  </div>
                </div>

                {/* Dana Saat Ini */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">
                    Dana Saat Ini
                  </label>

                  <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                    <span className="absolute left-3 text-slate-400 font-semibold sm:border-r sm:borderslate-200 pr-2 sm:pr-3 py-1 text-sm sm:text-base">
                      Rp
                    </span>

                    <input
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-9  md:pl-15 pr-3 sm:pr-4 text-slate-900 font-bold text-sm sm:text-lg focus:outline-none focus:border-[#2b4eff] transition-colors"
                      onChange={handleCurrencyInput}
                      value={formData.currentFunds ? formatRupiah(formData.currentFunds) : ""}
                      name="currentFunds"
                      type="text"
                      inputMode="numeric"
                      placeholder="20.000.000"
                    />
                  </div>
                </div>
              </div>

              <button
                className={`w-full py-2.5 sm:py-3  ${isFormComplete ? "bg-[#2b4eff] hover:bg-[#203bbf]" : "bg-gray-400 cursor-not-allowed"} text-white rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-[#2b4eff]/20 transition-all active:scale-[0.98] cursor-pointer`}
                type="button"
                onClick={calculateEducationFund}
                disabled={!isFormComplete}
              >
                Hitung Sekarang
              </button>
            </form>
          </div>
        </section>

        {/* Result Section */}
        {calculationResult && (
          <section className="p-5 pt-0 lg:pt-5  lg:pl-0  w-full lg:w-5/8 flex justify-center animate-slide-in">
            <div className="w-full max-w-180 lg:max-w-none flex flex-col lg:justify-evenly xl:justify-start space-y-3 lg:space-y-0 xl:space-y-4">
              {/* Hero Result */}
              <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-xl p-5 sm:p-6 lg:p-4 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-2">
                  <h3 className="text-slate-500 text-[10px] sm:text-xs lg:text-[10px] font-bold uppercase tracking-widest">
                    Target Dana Pendidikan
                  </h3>
                  <div className="text-[10px] sm:text-xs lg:text-[10px] font-semibold text-[#2b4eff] bg-[#2b4eff]/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    {calculationResult.yearsToEnrollment} Tahun Lagi
                  </div>
                </div>

                <div className="flex items-baseline gap-2 sm:gap-3 lg:gap-2">
                  <span className="text-lg sm:text-xl lg:text-lg font-bold text-slate-400">Rp</span>
                  <span className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                    {formatRupiah(calculationResult.enrollmentFee + calculationResult.totalTuition)}
                  </span>
                </div>

                <p className="mt-2 sm:mt-3 lg:mt-2 text-xs sm:text-sm lg:text-xs text-slate-500">
                  Estimasi kebutuhan total agar biaya pendidikan masa depan tercapai.
                </p>

                <div className="mt-3 sm:mt-4 lg:mt-3">
                  <div className="flex justify-between text-[10px] sm:text-xs lg:text-[10px] text-slate-500 mb-1.5 lg:mb-1">
                    <span>Dana Saat Ini</span>
                    <span>{calculationResult.progressPercentage.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 sm:h-3 lg:h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2b4eff] rounded-full transition-all duration-500"
                      style={{ width: `${calculationResult.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Rincian Kebutuhan & Sisa Target */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-3">
                <div className="border rounded-xl sm:rounded-2xl lg:rounded-xl p-5 sm:p-6 lg:p-4 bg-white border-slate-100 shadow-sm">
                  <h1 className="font-bold text-md sm:text-lg lg:text-sm mb-2 lg:mb-2">Rincian Kebutuhan Masa Depan</h1>

                  <div className="flex gap-2.5 lg:gap-2">
                    <div className="flex flex-col flex-1 ring-2 ring-slate-300/30 shadow-md px-3 py-2.5 lg:py-2 rounded-xl bg-slate-100">
                      <h1 className="text-xs font-bold tracking-wide text-gray-500 mb-5">UANG PANGKAL</h1>
                      <p className="text-xl lg:text-xl font-extrabold tracking-wide">
                        Rp {formatShort(calculationResult.enrollmentFee)}
                      </p>
                    </div>

                    <div className="flex flex-col flex-1 ring-2 ring-slate-300/30 shadow-md px-3 py-2.5 lg:py-2 rounded-xl bg-slate-100">
                      <h1 className="text-xs font-bold tracking-wide text-gray-500 mb-5">TOTAL SPP</h1>
                      <p className="text-xl lg:text-xl font-extrabold tracking-wide">
                        Rp {formatShort(calculationResult.totalTuition)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-5 lg:mt-4">
                    <p className="text-xs lg:text-sm text-gray-600">Durasi Pendidikan</p>
                    <p className="text-sm lg:text-sm font-bold">{calculationResult.educationDuration} Tahun</p>
                  </div>
                </div>

                <div className="border rounded-xl sm:rounded-2xl lg:rounded-xl p-5 sm:p-6 lg:p-4 bg-white border-slate-100 shadow-sm flex flex-col gap-3 sm:gap-4 lg:gap-0 md:justify-between">
                  <div>
                    <h1 className="font-bold text-md sm:text-lg lg:text-sm mb-1 lg:mb-0.5">Sisa Target Dana</h1>
                    <p className="text-xs sm:text-sm lg:text-[10px] text-slate-500 w-8/10 sm:w-full">
                      Jumlah kekurangan yang harus dipenuhi dalam periode investasi.
                    </p>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-xl font-bold">
                    Rp {formatRupiah(calculationResult.remainingFunds || 0)}
                  </h1>
                </div>
              </div>

              {/* Risk Profile */}
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
                      Rp {formatShort(calculationResult.conservativeHigh)} –{" "}
                      {formatShort(calculationResult.conservativeLow)}
                    </p>

                    <p className="text-[10px] sm:text-xs lg:text-[9px] text-slate-500">
                      Target return 5% – 6% per tahun
                    </p>
                  </div>

                  <div className="border border-slate-200 hover:border-[#2b4eff] rounded-xl p-4 sm:p-5 lg:p-3 shadow-md hover:ring-4 hover:ring-[#2b4eff]/10 transition-all duration-200">
                    <p className="text-[10px] sm:text-xs lg:text-[9px] uppercase font-extrabold tracking-widest text-[#2b4eff] mb-1 sm:mb-2 lg:mb-1">
                      Moderat
                    </p>
                    <p className="text-base sm:text-lg lg:text-sm font-bold text-slate-900 mb-0.5 sm:mb-1">
                      Rp {formatShort(calculationResult.moderateHigh)} – {formatShort(calculationResult.moderateLow)}
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
                      Rp {formatShort(calculationResult.aggressiveHigh)} –{" "}
                      {formatShort(calculationResult.aggressiveLow)}
                    </p>
                    <p className="text-[10px] sm:text-xs lg:text-[9px] text-slate-500">
                      Target return 11% – 15% per tahun
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default EducationFund;
