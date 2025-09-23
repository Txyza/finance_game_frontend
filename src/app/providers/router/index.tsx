import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BrandbookPage } from '@pages/brandbook'
import { MainPage } from '@pages/main'
import { WorkPage } from '@pages/work'
import { Game2048Page } from '@pages/work/2048'
import { MemoryPage } from '../../../pages/work/memory'
import { AnalyticsPage } from '@pages/analytics'
import { LeaderboardPage } from '@pages/leaderboard/ui/LeaderboardPage'
import { TasksPage } from '@pages/tasks/ui/TasksPage'
import { NewsPage } from '@pages/news/ui/NewsPage'
import { ShopPage } from '@pages/shop/ui/ShopPage'

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
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/brandbook" element={<BrandbookPage />} />
      </Routes>
    </BrowserRouter>
  )
}