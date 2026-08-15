import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'showszn.selectedCityId'

interface CityContextValue {
  cityId: number | null
  setCityId: (cityId: number) => void
}

const CityContext = createContext<CityContextValue | null>(null)

export function CityProvider({ children }: { children: ReactNode }) {
  const [cityId, setCityIdState] = useState<number | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? Number(stored) : null
  })

  useEffect(() => {
    if (cityId !== null) {
      localStorage.setItem(STORAGE_KEY, String(cityId))
    }
  }, [cityId])

  function setCityId(id: number) {
    setCityIdState(id)
  }

  return <CityContext.Provider value={{ cityId, setCityId }}>{children}</CityContext.Provider>
}

export function useCity() {
  const ctx = useContext(CityContext)
  if (!ctx) {
    throw new Error('useCity must be used within a CityProvider')
  }
  return ctx
}
