import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@pages/home'
import { BrandbookPage } from '@pages/brandbook'
import { MainPage } from '@pages/main'

export const RouterProvider = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/brandbook" element={<BrandbookPage />} />
      </Routes>
    </BrowserRouter>
  )
}