import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import Landing from './pages/Landing'
import Documentation from './pages/Documentation'
import Login from './pages/Login'
import Dashboard from './pages/admin/Dashboard'
import ApiForm from './pages/admin/ApiForm'
import ApiList from './pages/admin/ApiList'
import Settings from './pages/admin/Settings'
import ApiKeys from './pages/admin/ApiKeys'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
            <Route path="/docs" element={<PageTransition><Documentation /></PageTransition>} />
            {/* Hidden admin login route */}
            <Route path="/dapz-secret-access" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route index element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="apis" element={<PageTransition><ApiList /></PageTransition>} />
              <Route path="apis/new" element={<PageTransition><ApiForm /></PageTransition>} />
              <Route path="apis/edit/:id" element={<PageTransition><ApiForm /></PageTransition>} />
              <Route path="settings" element={<PageTransition><Settings /></PageTransition>} />
              <Route path="apikeys" element={<PageTransition><ApiKeys /></PageTransition>} />
            </Route>
            {/* Catch-all redirect to homepage */}
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold gradient-text mb-4">404</h1>
        <p className="text-dark-300 mb-6">Page not found</p>
        <a href="/" className="btn-primary"><span>Back to Home</span></a>
      </div>
    </div>
  )
}

export default App
