import { RouterProvider } from '@app/providers/router'
import { StoreProvider } from '@app/providers/store'
import { UserProvider, TourProvider } from '@shared/context'

export const App = () => {
  return (
    <StoreProvider>
      <UserProvider>
        <TourProvider>
          <RouterProvider />
        </TourProvider>
      </UserProvider>
    </StoreProvider>
  )
}