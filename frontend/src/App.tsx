import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { OverviewPage } from './pages/OverviewPage'
import { TenpistasPage } from './pages/TenpistasPage'
import { TransactionsPage } from './pages/TransactionsPage'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/tenpistas" element={<TenpistasPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
      </Route>
    </Routes>
  )
}

export default App
