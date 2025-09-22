import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BrandbookPage } from '@pages/brandbook'
import { MainPage } from '@pages/main'
import { WorkPage } from '@pages/work'
import { Game2048Page } from '@pages/work/2048'
import { MemoryPage } from '../../../pages/work/memory'

export const RouterProvider = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/2048" element={<Game2048Page />} />
        <Route path="/work/memory" element={<MemoryPage />} />
        <Route path="/brandbook" element={<BrandbookPage />} />
      </Routes>
    </BrowserRouter>
  )
}