import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { scrollTo } from "../utils/SmoothScroll";
import { BsBag } from "react-icons/bs";
import { FaGift } from "react-icons/fa";
import { useCart } from "../store/hooks/useCart";
import { useLanguage } from "../store/hooks/useLanguage";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  openSpinWheel,
  closeRewardsPanel,
  selectIdentifier,
  selectUnclaimedCount,
  selectShowRewardsPanel,
  selectRewards,
  claimReward,
  selectCanSpin,
  selectNextSpinDate,
  SPIN_INTERVAL_MS,
} from "../store/slices/rewardsSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [breakpoint, setBreakpoint] = useState("desktop");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { currentLang, changeLanguage, languages: availableLanguages, t } = useLanguage();
  const dispatch = useDispatch();
  const rewardsIdentifier = useSelector(selectIdentifier);
  const unclaimedRewardsCount = useSelector(selectUnclaimedCount);
  const showRewardsPanel = useSelector(selectShowRewardsPanel);
  const rewardsList = useSelector(selectRewards);
  const canSpin = useSelector(selectCanSpin);
  const nextSpinDate = useSelector(selectNextSpinDate);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!nextSpinDate || canSpin) {
      setCountdown('');
      return;
    }
    const tick = () => {
      const diff = new Date(nextSpinDate) - Date.now();
      if (diff <= 0) { setCountdown(''); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdown(h > 0 ? `${h}h ${m}m` : `${m}m`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [nextSpinDate, canSpin]);

  const {
    cartItems,
    getCartItemsCount,
  } = useCart();

  const cartCount = getCartItemsCount();

  const rewardsPanelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rewardsPanelRef.current && !rewardsPanelRef.current.contains(e.target)) {
        dispatch(closeRewardsPanel());
      }
    };
    if (showRewardsPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showRewardsPanel, dispatch]);

  const handleGiftClick = () => {
    navigate('/rewards');
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isExpired = (expiresAt) => expiresAt < Date.now();

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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMenuOpen]);

useEffect(() => {
  const handleClickOutside = () => {
    setOpenDropdown(null);
  };

  window.addEventListener("click", handleClickOutside);

  return () => {
    window.removeEventListener("click", handleClickOutside);
  };
}, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/explore", label: "Explore" },
    { path: "/products", label: "Products" },
    { path: "/cart", label: "Cart" },
    { path: "/blog", label: "Blog" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    {
      path: "",
      label: "Live Community Hub",
      dropdown: true,
      dropdownItems: [
        { path: "/impact", label: "Donation" },
        { path: "/challenges", label: "Challenges" },
        { path: "/chess", label: "Chess" },
        { path: "/challenges", label: "Lucky Draw" },
        { path: "/challenges", label: "Ride Challenge" },
      ],
    },
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
          // transform: isNavbarVisible ? "translateY(0)" : "translateY(-120%)",
          // transition: "transform 0.4s ease",

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
            fontSize: breakpoint === "mobile" ? "18px" : "30px",
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
            onClick={handleGiftClick}
            className="relative text-2xl cursor-pointer"
            style={{ color: '#000', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <div style={{ position: 'relative' }}>
              <FaGift />
              {unclaimedRewardsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-semibold rounded-full px-1.5 min-w-[18px] text-center">
                  {unclaimedRewardsCount}
                </span>
              )}
            </div>
            {countdown && (
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#EF4444',
                whiteSpace: 'nowrap',
                fontFamily: "'Inter', sans-serif",
              }}>
                {countdown}
              </span>
            )}
          </div>
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

      {showRewardsPanel && (
        <div
          ref={rewardsPanelRef}
          style={{
            position: 'fixed',
            top: breakpoint === 'mobile' ? 70 : 85,
            right: breakpoint === 'mobile' ? 8 : 24,
            width: breakpoint === 'mobile' ? 'calc(100vw - 16px)' : 380,
            maxHeight: '70vh',
            backgroundColor: '#fff',
            borderRadius: 16,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            zIndex: 1001,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>
                My Rewards
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#999' }}>
                {rewardsIdentifier}
              </p>
            </div>
            <button
              onClick={() => navigate('/rewards')}
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                border: 'none',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                color: '#1a1a1a',
              }}
            >
              View All
            </button>
          </div>
          <div style={{ overflow: 'auto', flex: 1, padding: 12 }}>
            {rewardsList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: '#999' }}>
                <FaGift size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: 13 }}>No rewards yet</p>
                <button
                  onClick={() => { dispatch(closeRewardsPanel()); dispatch(openSpinWheel()); }}
                  style={{
                    marginTop: 12,
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 20px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#1a1a1a',
                  }}
                >
                  Spin the Wheel!
                </button>
              </div>
            ) : (
              rewardsList.slice().reverse().map((reward) => {
                const expired = isExpired(reward.expiresAt);
                return (
                  <div
                    key={reward.id}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      marginBottom: 8,
                      backgroundColor: reward.claimed ? '#f9f9f9' : '#FFF8E1',
                      border: `1px solid ${reward.claimed ? '#eee' : '#FFE082'}`,
                      opacity: expired ? 0.5 : 1,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
                          {reward.label}
                        </p>
                        <p style={{ margin: '2px 0', fontSize: 11, color: '#888' }}>
                          {reward.type === 'reward_points' ? `${reward.value} points` :
                           reward.type === 'discount_percent' ? `${reward.value}% off` :
                           reward.type === 'free_shipping' ? 'Free shipping' : ''}
                        </p>
                        <p style={{ margin: 0, fontSize: 10, color: expired ? '#e53935' : '#aaa' }}>
                          {expired ? 'Expired' : `Expires ${formatDate(reward.expiresAt)}`}
                        </p>
                      </div>
                      <div>
                        {reward.claimed ? (
                          <span style={{ fontSize: 11, color: '#4CAF50', fontWeight: 600 }}>
                            Claimed
                          </span>
                        ) : !expired ? (
                          <button
                            onClick={() => dispatch(claimReward(reward.id))}
                            style={{
                              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                              border: 'none',
                              borderRadius: 6,
                              padding: '6px 14px',
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: 'pointer',
                              color: '#1a1a1a',
                            }}
                          >
                            Claim
                          </button>
                        ) : (
                          <span style={{ fontSize: 11, color: '#e53935', fontWeight: 600 }}>
                            Expired
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Menu Content - No overlay, directly below navbar */}
      <div
        style={{
          position: "fixed",
          top: breakpoint === "mobile" ? "0px" : "0px",
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
                justifyContent: breakpoint === "mobile" ? "flex-start" : "space-around",
                marginTop: breakpoint === "mobile" ? "16px" : "35px",
              }}
            >
              {/* Navigation Links */}
              <div
                style={{
                  display: "flex",
                  flexDirection: breakpoint === "mobile" ? "column" : "row",
                  justifyContent: "center",
                  gap: breakpoint === "mobile" ? "16px" : "20px",
                  alignItems: breakpoint === "mobile" ? "flex-start" : "center",
                  width: breakpoint === "mobile" ? "100%" : "auto",
                  paddingLeft: breakpoint === "mobile" ? "30px" : "0",
                }}
              >
              {navItems.map((item) => (
                <div key={item.label} style={{ position: "relative" }}>
                  
                  {/* Main Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      if (item.dropdown) {
                        setOpenDropdown(
                          openDropdown === item.label ? null : item.label
                        );
                      } else {
                        handleNavClick(item.path);
                      }
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "16px",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {item.label}
                    {item.dropdown && <FaChevronDown size={10} style={{ transform: openDropdown === item.label ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />}
                  </button>

                  {/* Dropdown */}
                  {item.dropdown && openDropdown === item.label && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        background: "#fff",
                        borderRadius: breakpoint === "mobile" ? "0" : "12px",
                        padding: breakpoint === "mobile" ? "4px 0 4px 12px" : "8px 0",
                        minWidth: breakpoint === "mobile" ? "100%" : "200px",
                        zIndex: 1000,
                        ...(breakpoint !== "mobile" ? {
                          position: "absolute",
                          top: "calc(100% + 8px)",
                          left: "50%",
                          transform: "translateX(-50%)",
                          border: "1px solid #f0f0f0",
                          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                          whiteSpace: "nowrap",
                        } : {
                          position: "relative",
                          marginTop: "4px",
                        }),
                      }}
                    >
                      {item.dropdownItems.map((subItem) => (
                        <button
                          key={subItem.path + subItem.label}
                          onClick={() => handleNavClick(subItem.path)}
                          style={{
                            display: "block",
                            width: "100%",
                            padding: breakpoint === "mobile" ? "8px 12px" : "10px 16px",
                            border: "none",
                            background: "transparent",
                            textAlign: "left",
                            cursor: "pointer",
                            fontSize: breakpoint === "mobile" ? "14px" : "14px",
                            color: "#555",
                            borderRadius: "8px",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f5f5"; e.currentTarget.style.color = "#000"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#555"; }}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              </div>

              {/* Right Side - Language Selection */}

              {/* <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: breakpoint === "mobile" ? "12px" : "16px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {Object.entries(availableLanguages).map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    style={{
                      background: "transparent",
                      border: "none",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: breakpoint === "mobile" ? "14px" : "16px",
                      color: currentLang === code ? "#000" : "#666",
                      fontWeight: currentLang === code ? 700 : 500,
                      cursor: "pointer",

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
              </div> */}
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
