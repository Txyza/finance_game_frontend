import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUserContext } from './UserContext'
import { calculateLevel } from '@shared/utils/levelCalculator'

interface TourState {
  mainPageVisited: boolean
  workPageVisited: boolean
  cityPageVisited: boolean
  completedMainTour: boolean
  completedWorkTour: boolean
  completedCityTour: boolean
  completedCityFirstVisitTour: boolean
  completedSafeDistrictFirstVisitTour: boolean
}

interface TourContextType {
  tourState: TourState
  shouldShowMainTour: boolean
  shouldShowWorkTour: boolean
  shouldShowCityTour: boolean
  shouldShowCityFirstVisitTour: boolean
  shouldShowSafeDistrictFirstVisitTour: boolean
  setMainPageVisited: () => void
  setWorkPageVisited: () => void
  setCityPageVisited: () => void
  setMainTourCompleted: () => void
  setWorkTourCompleted: () => void
  setCityTourCompleted: () => void
  setCityFirstVisitTourCompleted: () => void
  setSafeDistrictFirstVisitTourCompleted: () => void
  setMainTourCompletedAndWorkPageVisited: () => void
  isCityTourActive: boolean
  setCityTourActive: (active: boolean) => void
  isNewUser: boolean
  isLevel3User: boolean
  isStateLoaded: boolean
}

const TourContext = createContext<TourContextType | undefined>(undefined)

const TOUR_STORAGE_KEY = 'cash-lvl-tour-state'

interface TourProviderProps {
  children: ReactNode
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const { user } = useUserContext()
  const [tourState, setTourState] = useState<TourState>({
    mainPageVisited: false,
    workPageVisited: false,
    cityPageVisited: false,
    completedMainTour: false,
    completedWorkTour: false,
    completedCityTour: false,
    completedCityFirstVisitTour: false,
    completedSafeDistrictFirstVisitTour: false
  })
  const [isStateLoaded, setIsStateLoaded] = useState(false)
  const [isCityTourActive, setIsCityTourActive] = useState(false)

  const isNewUser = user ? calculateLevel(user.experience) === 1 : false
  const isLevel3User = user ? calculateLevel(user.experience) >= 3 : false
  // Временно: если пользователь не новичок, но и не 3-го уровня, показываем тур города как тест
  const shouldTestCityTour = Boolean(user && !isNewUser && calculateLevel(user.experience) < 3)

  // Загружаем состояние туров из localStorage
  useEffect(() => {
    if (user?.id) {
      const storageKey = `${TOUR_STORAGE_KEY}-${user.id}`
      const savedState = localStorage.getItem(storageKey)

      if (savedState) {
        try {
          const parsed = JSON.parse(savedState)
          if (parsed && typeof parsed === 'object') {
            setTourState(parsed)
          }
        } catch (error) {
          console.error('Failed to parse tour state:', error)
        }
      }

      setIsStateLoaded(true)
    }
  }, [user?.id])

  // Сохраняем состояние туров в localStorage
  const saveTourState = (newState: TourState) => {
    if (user?.id) {
      const storageKey = `${TOUR_STORAGE_KEY}-${user.id}`
      const jsonString = JSON.stringify(newState)
      console.log('Сохраняем в localStorage с ключом:', storageKey)
      console.log('JSON для сохранения:', jsonString)
      localStorage.setItem(storageKey, jsonString)
      setTourState(newState)
      console.log('Состояние сохранено и обновлено в контексте')
    }
  }

  const setMainPageVisited = () => {
    const newState = { ...tourState, mainPageVisited: true }
    saveTourState(newState)
  }

  const setWorkPageVisited = () => {
    const newState = { ...tourState, workPageVisited: true }
    saveTourState(newState)
  }

  const setCityPageVisited = () => {
    const newState = { ...tourState, cityPageVisited: true }
    saveTourState(newState)
  }

  const setMainTourCompleted = () => {
    const newState = { ...tourState, completedMainTour: true }
    saveTourState(newState)
  }

  const setWorkTourCompleted = () => {
    const newState = { ...tourState, completedWorkTour: true }
    saveTourState(newState)
  }

  const setCityTourCompleted = () => {
    const newState = { ...tourState, completedCityTour: true }
    saveTourState(newState)
  }

  const setCityFirstVisitTourCompleted = () => {
    const newState = { ...tourState, completedCityFirstVisitTour: true }
    saveTourState(newState)
  }

  const setSafeDistrictFirstVisitTourCompleted = () => {
    const newState = { ...tourState, completedSafeDistrictFirstVisitTour: true }
    saveTourState(newState)
  }

  const setMainTourCompletedAndWorkPageVisited = () => {
    const newState = { ...tourState, completedMainTour: true, workPageVisited: true }
    saveTourState(newState)
  }

  const shouldShowMainTour = isNewUser && isStateLoaded && !tourState.completedMainTour
  const shouldShowWorkTour = isNewUser && isStateLoaded && !tourState.completedWorkTour
  const shouldShowCityTour = (isLevel3User || shouldTestCityTour) && isStateLoaded && !tourState.completedCityTour
  const shouldShowCityFirstVisitTour = isLevel3User && isStateLoaded && !tourState.completedCityFirstVisitTour
  const shouldShowSafeDistrictFirstVisitTour = isLevel3User && isStateLoaded && !tourState.completedSafeDistrictFirstVisitTour

  // Отладка для вычисления shouldShowWorkTour
  console.log('Вычисляем shouldShowWorkTour:', {
    isNewUser,
    isStateLoaded,
    completedWorkTour: tourState.completedWorkTour,
    shouldShowWorkTour,
    tourState
  })

  // Отладка для вычисления shouldShowCityTour
  console.log('Вычисляем shouldShowCityTour:', {
    isLevel3User,
    shouldTestCityTour,
    isStateLoaded,
    completedCityTour: tourState.completedCityTour,
    shouldShowCityTour,
    userLevel: user ? calculateLevel(user.experience) : 'no user',
    userExperience: user?.experience || 'no user',
    tourState
  })

  return (
    <TourContext.Provider
      value={{
        tourState,
        shouldShowMainTour,
        shouldShowWorkTour,
        shouldShowCityTour,
        shouldShowCityFirstVisitTour,
        shouldShowSafeDistrictFirstVisitTour,
        setMainPageVisited,
        setWorkPageVisited,
        setCityPageVisited,
        setMainTourCompleted,
        setWorkTourCompleted,
        setCityTourCompleted,
        setCityFirstVisitTourCompleted,
        setSafeDistrictFirstVisitTourCompleted,
        setMainTourCompletedAndWorkPageVisited,
        isCityTourActive,
        setCityTourActive: setIsCityTourActive,
        isNewUser,
        isLevel3User,
        isStateLoaded
      }}
    >
      {children}
    </TourContext.Provider>
  )
}

export const useTourContext = () => {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error('useTourContext must be used within a TourProvider')
  }
  return context
}