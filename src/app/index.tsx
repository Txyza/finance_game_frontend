import { RouterProvider } from '@app/providers/router'
import { StoreProvider } from '@app/providers/store'

export const App = () => {
  return (
    <StoreProvider>
      <RouterProvider />
    </StoreProvider>
  )
}