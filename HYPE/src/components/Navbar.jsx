import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { scrollTo } from "../utils/SmoothScroll";
import { BsBag } from "react-icons/bs";
import { CartProvider, useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [breakpoint, setBreakpoint] = useState("desktop");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { currentLang, changeLanguage, languages: availableLanguages, t } = useLanguage();
  const {
    cartItems,
    getCartItemsCount,
    // removeFromCart,
    // updateQuantity,
    // getCartTotal,
    // clearCart,
  } = useCart();

  const cartCount = getCartItemsCount();

  useEffect(() => {
    const updateBreakpoint = () => {
      const viewportWidth = window.innerWidth;
      if (viewportWidth < 768) {
        setBreakpoint("mobile");
      } else if (viewportWidth < 1024) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  // navbar visibility logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // scrolling down
        setIsNavbarVisible(false);
        setIsMenuOpen(false);

      } else {
        // scrolling up
        setIsNavbarVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/cart", label: "Cart" },
    { path: "/blog", label: "Blog" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const languages = [
    { code: "ENG", label: "ENG" },
    { code: "JPN", label: "日本語" },
    { code: "ITA", label: "ITA" },
    { code: "FRA", label: "FRA" },
    { code: "ESP", label: "ESP" },
    { code: "KOR", label: "한글" },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    // Use Lenis smooth scroll instead of window.scrollTo
    scrollTo(0, { duration: 0.8 });
  };
  
  const handleLanguageChange = (langCode) => {
    // setSelectedLanguage(langCode);
    changeLanguage(langCode);
    setIsMenuOpen(false);
    // Add language change logic here if needed
  };

  return (
    <>
      <nav
        style={{
          // backgroundColor: "#fff",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          padding: breakpoint === "mobile" ? "0px 6px" : "0px 9px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transform: isNavbarVisible ? "translateY(0)" : "translateY(-120%)",
          transition: "transform 0.4s ease",

          // ✨ glassy extras (optional but recommended)
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Logo */}
        <div
          onClick={() => handleNavClick("/")}
          style={{
            cursor: "pointer",
            fontFamily: "Nunito Sans",
            fontSize: breakpoint === "mobile" ? "18px" : "20px",
            color: "#000",
            fontWeight: 700,
          }}
        >
          {/* <img
            src="/assets/Logo.png"
            alt="Hyper Bite"
            style={{ height: breakpoint === "mobile" ? "50px" : "60px" }}
          /> */}
          <img
            src="/assets/Hyper_Bite_Logo.png"
            alt="Hyper Bite"
            style={{ height: breakpoint === "mobile" ? "80px" : "100px" }}
          />
        </div>
        <div className="flex items-center gap-6">
          <div
            onClick={() => navigate("/cart")}
            className="relative text-2xl cursor-pointer"
          >
            <BsBag />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 min-w-[18px] text-center">
                {cartCount}
              </span>
            )}
          </div>

          {/* Menu/Close Button - Always visible with animation */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#000",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: "48px",
              height: "48px",
            }}
          >
            <div
              style={{
                position: "absolute",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                opacity: isMenuOpen ? 0 : 1,
                transform: isMenuOpen
                  ? "rotate(-90deg) scale(0.8)"
                  : "rotate(0deg) scale(1)",
              }}
            >
              <IoMenu className="rotate-90 text-6xl" />
            </div>
            <div
              style={{
                position: "absolute",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen
                  ? "rotate(0deg) scale(1)"
                  : "rotate(90deg) scale(0.8)",
              }}
            >
              <IoClose className="text-6xl" />
            </div>
          </button>
        </div>
      </nav>

      {/* Menu Content - No overlay, directly below navbar */}
      <div
        style={{
          position: "fixed",
          top: breakpoint === "mobile" ? "0px" : "40px",
          left: 0,
          width: "100%",
          zIndex: 999,
          padding: breakpoint === "mobile" ? "15px 16px" : "40px 50px",
          backgroundColor: "#fff",
          transition:
            "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease",
          transform: isMenuOpen ? "translateY(0)" : "translateY(-20px)",
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? "auto" : "none",
        }}
      >
        {/* Content Container - Always in row layout */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: breakpoint === "mobile" ? "24px" : "48px",
            alignItems: "flex-start",
          }}
        >
          {/* Left Side - Brand and Navigation */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              flex: 1,
            }}
          >
            {/* Brand Name */}
            <div
              style={{
                fontFamily: "Nunito Sans",
                fontSize: breakpoint === "mobile" ? "22px" : "26px",
                color: "#000",
                marginBottom: "8px",
                paddingLeft: breakpoint === "mobile" ? "30px" : "120px",
                textAlign: breakpoint === "mobile" ? "left" : "left",
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.4s ease 0.1s, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s`,
                fontWeight: 700,
              }}
            >
              {/* Hyper Bite */}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: breakpoint === "mobile" ? "30px" : "35px",
              }}
            >
              {/* Navigation Links */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: breakpoint === "mobile" ? "16px" : "20px",
                }}
              >
                {navItems.map((item, index) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    style={{
                      background: "transparent",
                      border: "none",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: breakpoint === "mobile" ? "14px" : "16px",
                      color: isActive(item.path) ? "#000" : "#666",
                      cursor: "pointer",
                      fontWeight: isActive(item.path) ? 700 : 500,

                      /* ✅ Correct alignment */
                      textAlign: "left",
                      // padding: "8px 16px",   // normal padding
                      padding:
                        breakpoint === "mobile"
                          ? "8px 16px 8px 50px"
                          : "8px 16px 8px 160px",

                      width: "100%", // ensures full clickable width

                      opacity: isMenuOpen ? 1 : 0,
                      transform: isMenuOpen
                        ? "translateY(0)"
                        : "translateY(30px)",

                      transition: `color 0.2s ease,
          opacity 0.4s ease ${isMenuOpen ? 0.15 + index * 0.05 : 0}s,
          transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)
          ${isMenuOpen ? 0.15 + index * 0.05 : 0}s`,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.color = "#333";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.color = "#999";
                      }
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Right Side - Language Selection */}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  alignSelf: "flex-end", // ✅ move to left
                  gap: breakpoint === "mobile" ? "12px" : "16px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {Object.entries(availableLanguages).map(([code, lang]) => (
                  <button
                    key={code}
                    // onClick={() => changeLanguage(code)}
                    onClick={() => handleLanguageChange(code)}
                    style={{
                      background: "transparent",
                      border: "none",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: breakpoint === "mobile" ? "14px" : "16px",
                      color: currentLang === code ? "#000" : "#666",
                      fontWeight: currentLang === code ? 700 : 500,
                      cursor: "pointer",

                      /* ✅ Left alignment */
                      textAlign: "right",
                      width: "100%",
                      padding:
                        breakpoint === "mobile"
                          ? "8px 50px 8px 16px"
                          : "8px 160px 8px 16px",

                      opacity: isMenuOpen ? 1 : 0,
                      transform: isMenuOpen
                        ? "translateY(0)"
                        : "translateY(30px)",

                      transition: `color 0.2s ease,
          font-weight 0.2s ease,
          opacity 0.4s ease ${isMenuOpen ? 0.2 + 0.05 : 0}s,
          transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)
          ${isMenuOpen ? 0.2 + 0.05 : 0}s`,
                    }}
                    onMouseEnter={(e) => {
                      if (currentLang !== code) {
                        e.currentTarget.style.color = "#333";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentLang !== code) {
                        e.currentTarget.style.color = "#999";
                      }
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Instagram Icon */}
            <a
              href="https://www.instagram.com/hyperbite.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                marginTop: "auto",
                paddingTop: "16px",
                paddingLeft: breakpoint === "mobile" ? "0px" : "120px",
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.4s ease ${
                  0.15 + navItems.length * 0.05
                }s, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${
                  0.15 + navItems.length * 0.05
                }s`,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ cursor: "pointer" }}
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
