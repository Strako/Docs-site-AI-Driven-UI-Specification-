import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Tutorial from './pages/Tutorial'
import Docs from './pages/Docs'

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/docs/:section" element={<Docs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  )
}
