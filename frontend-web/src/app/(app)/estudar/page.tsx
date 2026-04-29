'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { studyService } from '@/services/study.service'
import { DueCard, ReviewResult } from '@/types'
import { FlashCard } from '@/components/flashcard/FlashCard'
import { Loader2, CheckCircle, Trophy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function StudyPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)

  const { data: cards = [], isLoading, error } = useQuery<DueCard[]>({
    queryKey: ['dueCards'],
    queryFn: studyService.getDueCards,
  })

  const currentCard = cards[currentIndex]
  const progress = cards.length > 0 ? ((currentIndex) / cards.length) * 100 : 0

  const handleReview = (result: ReviewResult) => {
    setReviewedCount((prev) => prev + 1)
  }

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setSessionComplete(true)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 mt-4">Carregando cards...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-600">Erro ao carregar cards. Tente novamente.</p>
        <Link href="/dashboard" className="mt-4 text-blue-600 hover:underline">
          Voltar ao dashboard
        </Link>
      </div>
    )
  }

  // Session complete screen
  if (sessionComplete || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {cards.length === 0 ? 'Nenhum card para hoje 🎉' : 'Sessão concluída! 🎉'}
        </h1>
        <p className="text-gray-600 mb-2">
          {cards.length === 0 
            ? 'Você não tem cards para revisar hoje.'
            : `Você revisou ${reviewedCount} ${reviewedCount === 1 ? 'card' : 'cards'}.`
          }
        </p>
        <p className="text-gray-500 mb-8">
          {cards.length === 0 ? 'Volte amanhã para continuar aprendendo!' : 'Bom trabalho! Seu cérebro agradece.'}
        </p>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header with progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sessão de Estudo</h1>
            <p className="text-gray-500 text-sm mt-1">
              Card {currentIndex + 1} de {cards.length} • {currentCard.deck_title}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Sair
          </Link>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <FlashCard 
        card={currentCard} 
        onReview={handleReview}
        onNext={handleNext}
      />

      {/* Card metadata */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Intervalo atual: {currentCard.interval} dias • Repetições: {currentCard.repetitions}</p>
      </div>
    </div>
  )
}
