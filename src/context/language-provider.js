import { LoadingCircleProgress } from 'components/Utilities/progress'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSites } from './sites-provider'

export const CURRENT_LANGUAGE_KEY = 'current-language'

export const getLanguageFromLocalStorage = () => {
  return localStorage.getItem(CURRENT_LANGUAGE_KEY)
    ? localStorage.getItem(CURRENT_LANGUAGE_KEY)
    : 'en'
}

const LanguageContext = createContext({ languages: [] })
export const useLanguage = () => useContext(LanguageContext)

export const LanguageProvider = ({ children }) => {
  const [languages, setLanguages] = useState([])
  const { currentSite, sites } = useSites()
  const [currentLanguage, setCurrentLanguage] = useState()

  const setLanguage = (lang) => {
    setCurrentLanguage(lang)
    localStorage.setItem(CURRENT_LANGUAGE_KEY, lang)
  }

  const getLanguage = () => {
    return localStorage.getItem(CURRENT_LANGUAGE_KEY)
  }
  const isLanguageSet = () => {
    const language = getLanguage()
    return language && language !== 'null' ? language.length > 0 : false
  }

  const getLocalizedValue = (value) => {
    if (!value) return value
    if (typeof value === 'string' || value instanceof String) return value
    if (value[currentLanguage]) return value[currentLanguage]
    return value['en']
  }

  useEffect(() => {
    if (currentSite && sites.length > 0) {
      let currentSiteObject = sites.find((site) => site.code === currentSite)

      if (currentSiteObject && currentSiteObject.languages) {
        setLanguages(currentSiteObject.languages)

        if (window.location.pathname.startsWith('/en/')) {
          setLanguage('en')
        } else if (window.location.pathname.startsWith('/de/')) {
          setLanguage('de')
        } else if (isLanguageSet()) {
          setLanguage(getLanguage())
        } else {
          if (currentSiteObject.defaultLanguage) {
            setLanguage(currentSiteObject.defaultLanguage)
          }
        }
      }
    }

  }, [currentSite, sites.length])

  if (!currentLanguage) {
    return <LoadingCircleProgress />
  }
  return (
    <LanguageContext.Provider
      value={{
        languages,
        currentLanguage,
        setLanguage,
        getLocalizedValue,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
