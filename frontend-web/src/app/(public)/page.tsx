import { Brain, Layers, TrendingUp, Zap } from 'lucide-react'

export const metadata = {
  title: 'FlashMind - Estude menos. Aprenda mais.',
  description: 'Flashcards com repetição espaçada para memorizar qualquer coisa de verdade.',
  openGraph: {
    title: 'FlashMind - Estude menos. Aprenda mais.',
    description: 'Flashcards com repetição espaçada para memorizar qualquer coisa de verdade.',
    type: 'website',
  },
}

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Brain className="w-10 h-10 text-blue-400" />
            <span className="text-2xl font-bold">FlashMind</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Estude menos.<br />
            <span className="text-blue-400">Aprenda mais.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Flashcards com repetição espaçada para memorizar qualquer coisa de verdade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/cadastro"
              className="px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              Começar grátis
            </a>
            <a
              href="#features"
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
            >
              Ver demo
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para aprender
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nossa plataforma combina a ciência da memória com uma experiência simples e eficiente.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Repetição Espaçada</h3>
              <p className="text-gray-600">
                O algoritmo SM-2 calcula o momento exato para revisar cada card, maximizando a retenção de longo prazo.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Layers className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Estudo offline</h3>
              <p className="text-gray-600">
                Estude sem internet, sincroniza quando voltar. Nunca perca um dia de aprendizado.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Progresso real</h3>
              <p className="text-gray-600">
                Acompanhe streaks, estatísticas detalhadas e veja quantos cards você dominou.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-gray-600">
              Três passos simples para dominar qualquer assunto
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Crie seu deck de flashcards</h3>
                <p className="text-gray-600">
                  Monte seus próprios decks com perguntas e respostas. Organize por matéria, idioma ou qualquer tema.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Estude diariamente (5-10 min)</h3>
                <p className="text-gray-600">
                  Revisões rápidas todos os dias. Cada sessão leva poucos minutos, mas o efeito acumula ao longo do tempo.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">O algoritmo faz o resto</h3>
                <p className="text-gray-600">
                  O SM-2 calcula automaticamente quando você deve revisar cada card. Cards fáceis aparecem menos, difíceis mais vezes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para memorizar de verdade?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de estudantes que já transformaram seu aprendizado.
          </p>
          <a
            href="/cadastro"
            className="inline-block px-10 py-5 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-400 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            Criar conta grátis
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-center">
        <p>© 2024 FlashMind. Aprendizado eficiente para todos.</p>
      </footer>
    </main>
  )
}
