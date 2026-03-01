import React, { createContext, useContext, useEffect, useState } from "react";

import en from "../i18n/en.json";
import hi from "../i18n/hi.json";
import te from "../i18n/te.json";
import ar from "../i18n/ar.json";
import ne from "../i18n/ne.json";
import si from "../i18n/si.json";

const LanguageContext = createContext();

const languages = {
  en: { label: "English", translations: en },
  hi: { label: "Hindi", translations: hi },
  // te: { label: "Telugu", translations: te },
  ar: { label: "Arabic", translations: ar },
  ne: { label: "Nepali", translations: ne },
  si: { label: "Sinhala", translations: si },
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState("en"); // ✅ ALWAYS STRING
  useEffect(() => {
    // 1️⃣ localStorage
    const saved = localStorage.getItem("language");
    if (saved && languages[saved]) {
      setCurrentLang(saved);
      return;
    }

    // 2️⃣ browser language
    const browserLang = navigator.language.split("-")[0]; // hi-IN → hi
    if (languages[browserLang]) {
      setCurrentLang(browserLang);
    } else {
      setCurrentLang("en");
    }
  }, []);

  const changeLanguage = (langCode) => {
    if (!languages[langCode]) return;
    setCurrentLang(langCode);
    localStorage.setItem("language", langCode);
  };

  const t = (key) => {
    return (
      languages[currentLang]?.translations[key] ||
      languages.en.translations[key] ||
      key
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        changeLanguage,
        t,
        languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};