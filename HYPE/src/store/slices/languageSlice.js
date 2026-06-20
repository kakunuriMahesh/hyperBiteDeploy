import { createSlice } from '@reduxjs/toolkit'
import en from '../../i18n/en.json'
import hi from '../../i18n/hi.json'
import ar from '../../i18n/ar.json'
import ne from '../../i18n/ne.json'
import si from '../../i18n/si.json'

const languages = {
  en: { label: 'English', translations: en },
  hi: { label: 'Hindi', translations: hi },
  ar: { label: 'Arabic', translations: ar },
  ne: { label: 'Nepali', translations: ne },
  si: { label: 'Sinhala', translations: si },
}

const getInitialLang = () => {
  try {
    const saved = localStorage.getItem('language')
    if (saved && languages[saved]) return saved
    const browserLang = navigator.language.split('-')[0]
    if (languages[browserLang]) return browserLang
  } catch { /* ignore */ }
  return 'en'
}

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    currentLang: getInitialLang(),
  },
  reducers: {
    changeLanguage(state, action) {
      const langCode = action.payload
      if (!languages[langCode]) return
      state.currentLang = langCode
      try { localStorage.setItem('language', langCode) } catch { /* ignore */ }
    },
  },
})

export const { changeLanguage } = languageSlice.actions

export const selectCurrentLang = state => state.language.currentLang
export const selectLanguages = () => languages
export const selectT = state => {
  const lang = state.language.currentLang
  return (key) => languages[lang]?.translations[key] || languages.en.translations[key] || key
}

export default languageSlice.reducer
