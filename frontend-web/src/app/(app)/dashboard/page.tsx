'use client'

import { useQuery } from '@tanstack/react-query'
import { studyService } from '@/services/study.service'
import { StudyStats, Deck } from '@/types'
import { useAuthStore } from '@/store/auth.store'
import { Flame, BookOpen, CheckCircle, Trophy, Plus, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: stats, isLoading: statsLoading } = useQuery<StudyStats>({
    queryKey: ['stats'],
    queryFn: studyService.getStats,
  })

  const { data: decks, isLoading: decksLoading } = useQuery<Deck[]>({
    queryKey: ['decks'],
    queryFn: studyService.getDecks,
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  if (statsLoading || decksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Pronto para mais uma sessão de estudos?</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-sm text-gray-600">Streak atual</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.current_streak} <span className="text-lg font-normal text-gray-500">dias</span></p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Cards para hoje</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.cards_due_today}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Total de revisões</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total_reviews}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Cards dominados</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.cards_mastered}</p>
          </div>
        </div>
      )}

      {/* Study CTA */}
      {stats && stats.cards_due_today > 0 ? (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Hora de estudar!</h2>
              <p className="text-purple-100">
                Você tem {stats.cards_due_today} {stats.cards_due_today === 1 ? 'card' : 'cards'} aguardando revisão.
              </p>
            </div>
            <Link
              href="/estudar"
              className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              Estudar agora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-green-900">Tudo em dia!</h2>
              <p className="text-green-700">Você não tem cards para revisar hoje. Volte amanhã 🎉</p>
            </div>
          </div>
        </div>
      )}

      {/* Decks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Meus Decks</h2>
          <Link
            href="/decks/novo"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Criar novo deck
          </Link>
        </div>

        {decks && decks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg"
                      style={{ backgroundColor: deck.color || '#3B82F6' }}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{deck.title}</h3>
                      <p className="text-sm text-gray-500">
                        {deck.card_count || 0} {deck.card_count === 1 ? 'card' : 'cards'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Você ainda não tem decks</p>
            <Link
              href="/decks/novo"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Crie seu primeiro deck
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
