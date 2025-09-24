import { RouterProvider } from '@app/providers/router'
import { StoreProvider } from '@app/providers/store'
import { UserProvider } from '@shared/context'

export const App = () => {
  return (
    <StoreProvider>
      <UserProvider>
        <RouterProvider />
      </UserProvider>
    </StoreProvider>
  )
}