import { Component } from 'react'

// Captura erros de renderização e evita a "tela branca" — mostra um fallback
// amigável em vez de desmontar todo o app.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Log para depuração; em produção pode ser enviado a um serviço de erros.
    console.error('ErrorBoundary capturou um erro:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <div className="w-14 h-14 rounded-full bg-yanmar-red/10 text-yanmar-red flex items-center justify-center text-2xl mb-4">
            !
          </div>
          <h1 className="text-lg font-bold text-yanmar-dark mb-1">Algo deu errado</h1>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            Ocorreu um erro inesperado ao carregar esta página. Tente novamente ou volte ao início.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="bg-yanmar-red text-white px-5 py-2.5 rounded-sm text-sm font-bold hover:bg-yanmar-red-dark transition-colors"
            >
              Tentar novamente
            </button>
            <a href="/" className="text-sm text-gray-500 hover:text-yanmar-red transition-colors">
              Voltar ao início
            </a>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
