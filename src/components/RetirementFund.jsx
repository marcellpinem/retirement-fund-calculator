import { Banknote, TrendingUp, Umbrella, User, Wallet } from "lucide-react";
import {
  formatRupiah,
  formatShort,
  hitungSelisihUsia,
  hitungDanaPensiun,
  hitungProgress,
  hitungTabunganBulanan,
} from "../utils/calculator";
import { useState } from "react";

const RetirementFund = () => {
  const MAX_RETIREMENT_FUND = 100_000_000_000;
  const MAX_MONTHLY_EXPENSES = 1_000_000_000;
  const MAX_AGE = 100;
  const MIN_AGE = 15;
  const DEFAULT_RETIREMENT_AGE_OFFSET = 10;

  const [formData, setFormData] = useState({
    currentFunds: "",
    monthlyExpenses: "",
    currentAge: "",
    retirementAge: "",
    inflationRate: "",
  });

  const [calculationResult, setCalculationResult] = useState(null);
  const [isRetirementAgeAutoFilled, setIsRetirementAgeAutoFilled] = useState(true);

  const handleCurrencyInput = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value.replace(/\D/g, ""));

    const maxLimit = name === "monthlyExpenses" ? MAX_MONTHLY_EXPENSES : MAX_RETIREMENT_FUND;
    const validatedValue = Math.min(numericValue, maxLimit);

    setFormData((prev) => ({
      ...prev,
      [name]: validatedValue,
    }));
  };

  const handleCurrentAgeInput = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");

    setFormData((prev) => {
      let updatedRetirementAge = prev.retirementAge;

      if (isRetirementAgeAutoFilled && numericValue !== "") {
        updatedRetirementAge = String(Number(numericValue) + DEFAULT_RETIREMENT_AGE_OFFSET);
      }

      return {
        ...prev,
        currentAge: numericValue,
        retirementAge: updatedRetirementAge,
      };
    });
  };

  const validateCurrentAge = () => {
    setFormData((prev) => {
      if (!prev.currentAge) return prev;

      const validatedAge = Math.max(MIN_AGE, Math.min(Number(prev.currentAge), MAX_AGE));

      return {
        ...prev,
        currentAge: String(validatedAge),
      };
    });
  };

  const handleRetirementAgeInput = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");

    setIsRetirementAgeAutoFilled(false);

    setFormData((prev) => ({
      ...prev,
      retirementAge: numericValue,
    }));
  };

  const validateRetirementAge = () => {
    setFormData((prev) => {
      if (!prev.retirementAge) return prev;

      const currentAge = Number(prev.currentAge);
      let retirementAge = Number(prev.retirementAge);

      if (retirementAge <= currentAge) {
        retirementAge = currentAge + 1;
      }

      if (retirementAge > MAX_AGE) {
        retirementAge = MAX_AGE;
      }

      return {
        ...prev,
        retirementAge: String(retirementAge),
      };
    });
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

      const validatedRate = Math.min(Number(prev.inflationRate), 100);

      return {
        ...prev,
        inflationRate: String(validatedRate),
      };
    });
  };

  const isFormComplete =
    formData.currentAge !== "" &&
    formData.retirementAge !== "" &&
    formData.monthlyExpenses !== "" &&
    formData.currentFunds !== "" &&
    formData.inflationRate !== "";

  const calculateRetirementPlan = () => {
    const yearsToRetirement = hitungSelisihUsia(Number(formData.currentAge), Number(formData.retirementAge));

    const totalRetirementFund = hitungDanaPensiun(
      Number(formData.currentAge),
      Number(formData.retirementAge),
      Number(formData.inflationRate || 0),
      formData.monthlyExpenses,
    );

    const fundingProgress = hitungProgress(totalRetirementFund, formData.currentFunds);
    const remainingFunds = Math.max(0, totalRetirementFund - formData.currentFunds);

    setCalculationResult({
      yearsToRetirement,
      totalRetirementFund,
      progressPercentage: fundingProgress,
      remainingFunds,
      conservativeLow: hitungTabunganBulanan(remainingFunds, 5, yearsToRetirement),
      conservativeHigh: hitungTabunganBulanan(remainingFunds, 6, yearsToRetirement),
      moderateLow: hitungTabunganBulanan(remainingFunds, 7, yearsToRetirement),
      moderateHigh: hitungTabunganBulanan(remainingFunds, 10, yearsToRetirement),
      aggressiveLow: hitungTabunganBulanan(remainingFunds, 11, yearsToRetirement),
      aggressiveHigh: hitungTabunganBulanan(remainingFunds, 15, yearsToRetirement),
    });
  };

  return (
    <>
      <title>Kalkulator Pensiun</title>

      <main
        className={`flex flex-col lg:flex-row items-center ${!calculationResult ? "lg:justify-center" : ""} min-h-full p-5 lg:py-0 gap-5 bg-gray-200`}
      >
        {/* FORM SECTION */}
        <section className="w-full max-w-180 lg:w-1/3 h-full bg-white rounded-xl p-4 sm:p-6 lg:p-10">
          <div className="mb-4 sm:mb-5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 tracking-tight text-center lg:text-start">
              Kalkulator Pensiun
            </h1>

            <p className={`text-slate-500 text-xs sm:text-sm leading-relaxed tracking-wide text-center lg:text-start`}>
              Mulai rencanakan kebebasan finansial hari tua anda
            </p>
          </div>

          <form className="w-full space-y-5 sm:space-y-6 lg:space-y-8">
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
                  name="currentFunds"
                  type="text"
                  inputMode="numeric"
                  value={formData.currentFunds ? formatRupiah(formData.currentFunds) : ""}
                  onChange={handleCurrencyInput}
                  placeholder="50.000.000"
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-20 sm:pl-28 pr-3 sm:pr-4 text-slate-900 font-bold text-base sm:text-lg focus:outline-none focus:border-[#2b4eff] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Usia Sekarang & Usia Pensiun */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3">Usia Sekarang</label>
                <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                  <div className="absolute left-3 sm:left-4 text-slate-400">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <input
                    className="w-full bg-white border border-slate-200 focus:border-[#2b4eff] rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-14 sm:pr-16 text-slate-900 font-bold text-base sm:text-lg focus:outline-none transition-colors"
                    type="text"
                    inputMode="numeric"
                    value={formData.currentAge}
                    onChange={handleCurrentAgeInput}
                    onBlur={validateCurrentAge}
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
                <div className="relative flex items-center shadow-sm rounded-xl transition-all focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#2b4eff]/20">
                  <div className="absolute left-3 sm:left-4 text-slate-400">
                    <Umbrella className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <input
                    className="w-full bg-white border border-slate-200 focus:border-[#2b4eff] rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-14 sm:pr-16 text-slate-900 font-bold text-base sm:text-lg focus:outline-none transition-colors"
                    type="text"
                    inputMode="numeric"
                    value={formData.retirementAge}
                    onChange={handleRetirementAgeInput}
                    onBlur={validateRetirementAge}
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
                  name="monthlyExpenses"
                  type="text"
                  inputMode="numeric"
                  value={formData.monthlyExpenses ? formatRupiah(formData.monthlyExpenses) : ""}
                  onChange={handleCurrencyInput}
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
                  value={formData.inflationRate}
                  onChange={handleInflationInput}
                  onBlur={validateInflation}
                  placeholder="5"
                  required
                />
                <span className="absolute right-3 sm:right-4 text-slate-400 text-base sm:text-lg font-bold">%</span>
              </div>
            </div>

            <button
              className={`w-full py-2.5 sm:py-3  ${isFormComplete ? "bg-[#2b4eff] hover:bg-[#203bbf]" : "bg-gray-400 cursor-not-allowed"} text-white rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-[#2b4eff]/20 transition-all active:scale-[0.98] cursor-pointer`}
              type="button"
              onClick={calculateRetirementPlan}
              disabled={!isFormComplete}
            >
              Hitung Sekarang
            </button>
          </form>
        </section>

        {/* RESULT SECTION */}
        {calculationResult && (
          <section className="w-full lg:w-2/3 h-full flex flex-col rounded-xl animate-slide-in">
            <div className="w-full space-y-4 sm:space-y-7">
              {/* Hero Target */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    Target Dana Pensiun
                  </h3>
                  <div className="text-[10px] sm:text-xs font-semibold text-[#2b4eff] bg-[#2b4eff]/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    {calculationResult.yearsToRetirement} Tahun Lagi
                  </div>
                </div>

                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-400">Rp</span>
                  <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 leading-none">
                    {formatRupiah(calculationResult.totalRetirementFund)}
                  </span>
                </div>

                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-500">
                  Estimasi kebutuhan total agar gaya hidup tetap terjaga saat pensiun.
                </p>

                <div className="mt-4 sm:mt-6">
                  <div className="flex justify-between text-[10px] sm:text-xs text-slate-500 mb-2">
                    <span>Dana Saat Ini</span>
                    <span>{calculationResult.progressPercentage.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2b4eff]  rounded-full transition-all duration-500"
                      style={{ width: `${calculationResult.progressPercentage}%` }}
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
                    Rp {formatRupiah(calculationResult.remainingFunds)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
                    Selisih yang perlu kamu akumulasi dalam {calculationResult.yearsToRetirement} tahun.
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#2b4eff]/10 flex items-center justify-center text-[#2b4eff] shrink-0">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>

              {/* Risk Profile */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm border border-slate-100 select-none">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-6">
                  Rekomendasi Tabungan Bulanan
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  <div className="border border-slate-200 hover:border-[#2b4eff] rounded-xl p-4 sm:p-5 shadow-md hover:ring-4 hover:ring-[#2b4eff]/10 transition-all duration-200">
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 mb-1 sm:mb-2">
                      Konservatif
                    </p>

                    <p className="text-base sm:text-lg font-bold text-slate-900 mb-0.5 sm:mb-1">
                      Rp {formatShort(calculationResult.conservativeHigh)} –{" "}
                      {formatShort(calculationResult.conservativeLow)}
                    </p>

                    <p className="text-[10px] sm:text-xs text-slate-500">Target return 5% – 6% per tahun</p>
                  </div>

                  <div className="border border-slate-200 hover:border-[#2b4eff] rounded-xl p-4 sm:p-5 shadow-md hover:ring-4 hover:ring-[#2b4eff]/10 transition-all duration-200">
                    <p className="text-[10px] sm:text-xs uppercase font-extrabold  tracking-widest text-[#2b4eff] mb-1 sm:mb-2">
                      Moderat
                    </p>
                    <p className="text-base sm:text-lg font-bold text-slate-900 mb-0.5 sm:mb-1">
                      Rp {formatShort(calculationResult.moderateHigh)} – {formatShort(calculationResult.moderateLow)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Target return 7% – 10% per tahun</p>
                  </div>

                  <div className="border border-slate-200 hover:border-[#2b4eff] rounded-xl p-4 sm:p-5 shadow-md hover:ring-4 hover:ring-[#2b4eff]/10 transition-all duration-200">
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 mb-1 sm:mb-2">
                      Agresif
                    </p>
                    <p className="text-base sm:text-lg font-bold text-slate-900 mb-0.5 sm:mb-1">
                      Rp {formatShort(calculationResult.aggressiveHigh)} –{" "}
                      {formatShort(calculationResult.aggressiveLow)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Target return 11% – 15% per tahun</p>
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

export default RetirementFund;
