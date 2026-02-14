import { Menu, PiggyBank, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navStyle = ({ isActive }) =>
    `transition-all duration-200 px-4 py-3 rounded-lg ${isActive ? "text-white bg-[#2b4eff] hover:bg-[#203bbf]" : "text-slate-500 hover:bg-[#2b4eff]/10 hover:text-[#2b4eff]"}`;

  return (
    <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="flex h-20 px-4 sm:px-6 lg:px-12 items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2b4eff] rounded-lg flex items-center justify-center shadow-lg shadow-[#2b4eff]/30">
            <PiggyBank className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <NavLink to="/" className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
            Financial<span className="text-[#2b4eff]">Plan</span>
          </NavLink>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 hover:bg-slate-50 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold">
          <NavLink to="/pensiun" className={navStyle}>
            Dana Pensiun
          </NavLink>
          <NavLink to="/pendidikan" className={navStyle}>
            Dana Pendidikan
          </NavLink>
          <NavLink to="/darurat" className={navStyle}>
            Dana Darurat
          </NavLink>
        </div>
      </div>

      {/* Backdrop dengan fade */}
      <div
        className={`fixed inset-0 bg-black/20 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 z-40" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu dengan slide down */}
      <div
        className={`absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 z-50" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-4 py-3 space-y-1 text-sm font-semibold">
          <NavLink
            to="/pensiun"
            className={({ isActive }) => `py-3 px-3 rounded-lg ${navStyle({ isActive })}`}
            onClick={() => setIsOpen(false)}
          >
            Dana Pensiun
          </NavLink>
          <NavLink
            to="/pendidikan"
            className={({ isActive }) => `py-3 px-3 rounded-lg ${navStyle({ isActive })}`}
            onClick={() => setIsOpen(false)}
          >
            Dana Pendidikan
          </NavLink>
          <NavLink
            to="/darurat"
            className={({ isActive }) => `py-3 px-3 rounded-lg ${navStyle({ isActive })}`}
            onClick={() => setIsOpen(false)}
          >
            Dana Darurat
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
