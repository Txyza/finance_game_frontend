import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@pages/home'
import { BrandbookPage } from '@pages/brandbook'

export const RouterProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/brandbook" element={<BrandbookPage />} />
      </Routes>
    </BrowserRouter>
  )
}