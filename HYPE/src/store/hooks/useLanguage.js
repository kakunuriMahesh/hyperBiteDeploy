import { useDispatch, useSelector } from 'react-redux'
import {
  changeLanguage as changeLanguageAction,
  selectCurrentLang,
  selectLanguages,
  selectT,
} from '../slices/languageSlice'

export const useLanguage = () => {
  const dispatch = useDispatch()
  const currentLang = useSelector(selectCurrentLang)
  const t = useSelector(selectT)
  const languages = selectLanguages()

  return {
    currentLang,
    changeLanguage: (langCode) => dispatch(changeLanguageAction(langCode)),
    t,
    languages,
  }
}
