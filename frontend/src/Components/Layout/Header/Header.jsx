import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact-us" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-5000 transition-all duration-500 ${
        isScrolled 
          ? "bg-[#0A0F1E]/95 backdrop-blur-xl shadow-2xl border-b border-white/10" 
          : "bg-white/10 backdrop-blur-md"
      }`}
      style={{ fontFamily: "Parkinsans, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 md:py-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer group">
          <img src={logo} alt="logo" className="w-70 h-20 object-contain transition-transform duration-300 group-hover:scale-105" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`relative font-medium transition-all duration-300 group ${
                // Always ensure text is dark enough or has a shadow for visibility
                isScrolled
                  ? "text-gray-200 hover:text-white"
                  : "text-gray-800 hover:text-gray-900"
              } ${
                location.pathname === link.href
                  ? "font-semibold"
                  : ""
              }`}
              style={{
                textShadow: !isScrolled ? "0 1px 2px rgba(255,255,255,0.5)" : "none"
              }}
            >
              {link.name}
              <span
                className={`absolute left-0 -bottom-1 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                  location.pathname === link.href ? "w-full" : ""
                } bg-gradient-to-r from-[#FFD700] to-[#FF9F43]`}
              ></span>
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/school-login")}
            className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm ${
              isScrolled
                ? "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 hover:shadow-lg"
                : "bg-black/10 border border-black/20 text-gray-800 hover:bg-black/20 hover:border-black/40"
            }`}
          >
            For Schools
          </button>
          <button
            onClick={() => navigate("/teacher-login")}
            className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
              isScrolled
                ? "bg-gradient-to-r from-[#FFD700] to-[#FF9F43] text-gray-900 hover:from-[#FFED4E] hover:to-[#FFB347]"
                : "bg-gradient-to-r from-[#FFD700] to-[#FF9F43] text-gray-900 hover:from-[#FFED4E] hover:to-[#FFB347]"
            }`}
          >
            For Teachers
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden transition p-2 rounded-lg ${
            isScrolled 
              ? "text-white bg-white/10 hover:bg-white/20" 
              : "text-gray-800 bg-black/5 hover:bg-black/10"
          }`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown - Modern Glass Design */}
      {isOpen && (
        <div
          className={`md:hidden shadow-2xl animate-slideDown ${
            isScrolled
              ? "bg-[#0A0F1E]/95 backdrop-blur-xl border-t border-white/10"
              : "bg-white/95 backdrop-blur-xl border-t border-gray-200"
          }`}
        >
          <div className="flex flex-col items-center py-6 space-y-4">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-semibold transition-all duration-300 py-2 px-4 rounded-lg ${
                  location.pathname === link.href
                    ? "text-[#FF9F43] bg-black/5"
                    : isScrolled 
                      ? "text-white/80 hover:text-white hover:bg-white/5"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="w-full px-6 pt-4 space-y-3">
              <button
                onClick={() => {
                  navigate("/school-login");
                  setIsOpen(false);
                }}
                className={`w-full py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm ${
                  isScrolled
                    ? "bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40"
                    : "bg-black/10 border border-black/20 text-gray-800 hover:bg-black/20 hover:border-black/40"
                }`}
              >
                For Schools
              </button>
              <button
                onClick={() => {
                  navigate("/teacher-login");
                  setIsOpen(false);
                }}
                className="w-full py-3 rounded-full font-semibold transition-all duration-300 bg-gradient-to-r from-[#FFD700] to-[#FF9F43] text-gray-900 hover:shadow-lg hover:scale-105"
              >
                For Teachers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add custom CSS for slideDown animation */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Header;