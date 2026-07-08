import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ToastContainer } from '@/components/ui'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import ErrorBoundary from '@/components/shared/ErrorBoundary'

// Páginas públicas
import Home           from '@/pages/public/Home'
import Maquinas       from '@/pages/public/Maquinas'
import DetalhesMaquina from '@/pages/public/DetalhesMaquina'
import Sobre          from '@/pages/public/Sobre'
import Contato        from '@/pages/public/Contato'
import Login          from '@/pages/public/Login'

// Painéis
import PainelDealer   from '@/pages/dealer/PainelDealer'
import PainelAdmin    from '@/pages/admin/PainelAdmin'

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1"><ErrorBoundary>{children}</ErrorBoundary></main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/maquinas" element={<Layout><Maquinas /></Layout>} />
          <Route path="/maquinas/:id" element={<Layout><DetalhesMaquina /></Layout>} />
          <Route path="/sobre" element={<Layout><Sobre /></Layout>} />
          <Route path="/contato" element={<Layout><Contato /></Layout>} />
          <Route path="/entrar" element={<Layout><Login /></Layout>} />

          {/* Painel concessionária */}
          <Route path="/painel" element={
            <ProtectedRoute role="dealer">
              <Layout><PainelDealer /></Layout>
            </ProtectedRoute>
          } />

          {/* Painel admin YANMAR */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <Layout><PainelAdmin /></Layout>
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                <p className="text-6xl mb-4">404</p>
                <p className="text-lg font-medium text-gray-600">Página não encontrada</p>
                <a href="/" className="mt-4 text-sm text-yanmar-red hover:underline">Voltar ao início</a>
              </div>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
