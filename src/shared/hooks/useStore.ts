import { useState, useEffect, useCallback } from 'react'
import { storeApi, StoreListResponse, StoreItem, ApiError } from '@shared/api'

interface UseStoreState {
  items: StoreItem[]
  loading: boolean
  error: ApiError | null
}

interface UseStoreActions {
  refreshItems: () => Promise<void>
  buyItem: (itemName: string) => Promise<boolean>
  clearError: () => void
}

type UseStoreReturn = UseStoreState & UseStoreActions

export const useStore = (): UseStoreReturn => {
  const [state, setState] = useState<UseStoreState>({
    items: [],
    loading: false,
    error: null
  })

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const refreshItems = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      console.log('useStore: Fetching store items...')
      const response: StoreListResponse = await storeApi.getStoreItems()

      console.log('useStore: Success, received items:', response.items.length)
      setState(prev => ({
        ...prev,
        items: response.items || [],
        loading: false
      }))
    } catch (error) {
      console.error('useStore: Error fetching store items:', error)
      const apiError = error as ApiError
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
    }
  }, [])

  const buyItem = useCallback(async (itemName: string): Promise<boolean> => {
    try {
      console.log('useStore: Buying item:', itemName)
      await storeApi.buyItem({ name: itemName })

      console.log('useStore: Item purchased successfully')

      // Обновляем список товаров после покупки
      await refreshItems()

      return true
    } catch (error) {
      console.error('useStore: Error buying item:', error)
      const apiError = error as ApiError
      setState(prev => ({ ...prev, error: apiError }))
      return false
    }
  }, [refreshItems])

  // Загружаем товары при монтировании хука
  useEffect(() => {
    refreshItems()
  }, [refreshItems])

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    refreshItems,
    buyItem,
    clearError
  }
}