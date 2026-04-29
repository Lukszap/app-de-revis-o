'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { studyService } from '@/services/study.service'
import { Deck, Card } from '@/types'
import { ArrowLeft, Plus, Trash2, Edit, Layers, FileText } from 'lucide-react'
import Link from 'next/link'

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  teal: 'bg-teal-500',
}

export default function DeckPage() {
  const router = useRouter()
  const params = useParams()
  const deckId = params.id as string

  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    if (deckId) {
      loadDeck()
    }
  }, [deckId])

  async function loadDeck() {
    try {
      const [deckData, cardsData] = await Promise.all([
        studyService.getDeck(deckId),
        studyService.getCards(deckId),
      ])
      setDeck(deckData)
      setCards(cardsData)
    } catch (error) {
      console.error('Erro ao carregar deck:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) {
      setDeleteConfirm(true)
      return
    }

    try {
      await studyService.deleteDeck(deckId)
      router.push('/meus-decks')
    } catch (error) {
      console.error('Erro ao deletar deck:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!deck) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Deck não encontrado</p>
        <Link
          href="/meus-decks"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Meus Decks
        </Link>
      </div>
    )
  }

  const colorClass = colorMap[deck.color] || 'bg-blue-500'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/meus-decks"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Meus Decks
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 ${colorClass} rounded-xl flex items-center justify-center`}>
              <Layers className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{deck.title}</h1>
              {deck.description && (
                <p className="text-gray-600 mt-1">{deck.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>{cards.length} cards</span>
                <span>•</span>
                <span>Criado {deck.created_at ? new Date(deck.created_at).toLocaleDateString('pt-BR') : 'recentemente'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                deleteConfirm
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {deleteConfirm ? 'Confirmar exclusão' : 'Excluir'}
            </button>
            <Link
              href={`/deck/${deckId}/editar`}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Link>
            <Link
              href={`/deck/${deckId}/novo-card`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo card
            </Link>
          </div>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum card neste deck
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Adicione cards de flashcard para começar a estudar
          </p>
          <Link
            href={`/deck/${deckId}/novo-card`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adicionar primeiro card
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Cards ({cards.length})</h2>
          <div className="grid gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                      Frente (Pergunta)
                    </span>
                    <p className="mt-2 text-gray-900 font-medium">{card.front}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                      Verso (Resposta)
                    </span>
                    <p className="mt-2 text-gray-700">{card.back}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
