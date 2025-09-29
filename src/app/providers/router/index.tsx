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
import { CityPage, DistrictPage } from '@pages/city'
import { SavingsPage, SavingsSelectPage, SavingsCreatePage, SavingsSuccessPage, SavingsAccountPage, SavingsDepositPage, SavingsWithdrawPage } from '@pages/savings'
import { DepositsPage, DepositsSelectPage, DepositsCalculatorPage, DepositsCreatePage, DepositsSuccessPage, DepositDetailsPage } from '@pages/deposits'
import { OnboardingPage } from '@pages/onboarding'
import { NotFoundPage } from '@pages/NotFound'
import { AuthManager } from '@shared/components'
import { usePageTracking } from '@shared/hooks/usePageTracking'
import { MainLayout } from '../../layouts/MainLayout'

const AppContent = () => {
  usePageTracking()

  return (
    <AuthManager>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/city" element={<CityPage />} />
            <Route path="/city/district/:districtId" element={<DistrictPage />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="/savings/select" element={<SavingsSelectPage />} />
            <Route path="/savings/create" element={<SavingsCreatePage />} />
            <Route path="/savings/success" element={<SavingsSuccessPage />} />
            <Route path="/savings/account/:accountId" element={<SavingsAccountPage />} />
            <Route path="/savings/deposit/:accountId" element={<SavingsDepositPage />} />
            <Route path="/savings/withdraw/:accountId" element={<SavingsWithdrawPage />} />
            <Route path="/deposits" element={<DepositsPage />} />
            <Route path="/deposits/select" element={<DepositsSelectPage />} />
            <Route path="/deposits/calculator" element={<DepositsCalculatorPage />} />
            <Route path="/deposits/create" element={<DepositsCreatePage />} />
            <Route path="/deposits/success" element={<DepositsSuccessPage />} />
            <Route path="/deposits/deposit/:depositId" element={<DepositDetailsPage />} />
            <Route path="/work" element={<WorkPage />} />
          </Route>
          {/* Страницы без навигации */}
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/work/2048" element={<Game2048Page />} />
          <Route path="/work/memory" element={<MemoryPage />} />
          <Route path="/brandbook" element={<BrandbookPage />} />
          {/* 404 страница */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthManager>
  )
}

export const RouterProvider = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AppContent />
    </BrowserRouter>
  )
}