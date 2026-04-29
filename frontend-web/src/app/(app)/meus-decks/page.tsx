'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { studyService } from '@/services/study.service'
import { Deck } from '@/types'
import { Plus, Layers, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const colors = [
  { bg: 'bg-blue-500', border: 'border-blue-500' },
  { bg: 'bg-green-500', border: 'border-green-500' },
  { bg: 'bg-purple-500', border: 'border-purple-500' },
  { bg: 'bg-orange-500', border: 'border-orange-500' },
  { bg: 'bg-pink-500', border: 'border-pink-500' },
  { bg: 'bg-teal-500', border: 'border-teal-500' },
]

export default function MeusDecksPage() {
  const router = useRouter()
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDecks()
  }, [])

  async function loadDecks() {
    try {
      const data = await studyService.getDecks()
      setDecks(data)
    } catch (error) {
      console.error('Erro ao carregar decks:', error)
    } finally {
      setLoading(false)
    }
  }

  function getColor(index: number) {
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Decks</h1>
          <p className="text-gray-600 mt-1">
            {decks.length} {decks.length === 1 ? 'deck' : 'decks'} criado{decks.length !== 1 && 's'}
          </p>
        </div>
        <Link
          href="/novo-deck"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Criar novo deck
        </Link>
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum deck ainda
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Crie seu primeiro deck de flashcards para começar a estudar
          </p>
          <Link
            href="/novo-deck"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Criar primeiro deck
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck, index) => {
            const color = getColor(index)
            return (
              <Link
                key={deck.id}
                href={`/deck/${deck.id}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${color.bg} rounded-lg flex items-center justify-center`}>
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {deck.title}
                </h3>
                {deck.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {deck.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{deck.card_count || 0} cards</span>
                  <span>•</span>
                  <span>Criado {deck.created_at ? new Date(deck.created_at).toLocaleDateString('pt-BR') : 'recentemente'}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
