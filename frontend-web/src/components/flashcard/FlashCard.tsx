'use client'

import { useState } from 'react'
import { DueCard, ReviewResult } from '@/types'
import { studyService } from '@/services/study.service'
import { Loader2 } from 'lucide-react'

interface FlashCardProps {
  card: DueCard
  onReview: (result: ReviewResult) => void
  onNext: () => void
}

const DIFFICULTY_OPTIONS = [
  { value: 0, label: 'Errei', color: 'bg-red-500 hover:bg-red-600', sublabel: 'ver amanhã' },
  { value: 1, label: 'Difícil', color: 'bg-orange-500 hover:bg-orange-600', sublabel: 'em breve' },
  { value: 2, label: 'Bom', color: 'bg-green-500 hover:bg-green-600', sublabel: 'lembrei' },
  { value: 3, label: 'Fácil', color: 'bg-blue-500 hover:bg-blue-600', sublabel: 'dominei' },
]

export function FlashCard({ card, onReview, onNext }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)

  const handleFlip = () => {
    if (!isSubmitting && !result) {
      setIsFlipped(!isFlipped)
    }
  }

  const handleReview = async (quality: number) => {
    setIsSubmitting(true)
    try {
      const reviewResult = await studyService.submitReview(card.card_id, quality)
      setResult(reviewResult)
      onReview(reviewResult)
      
      // Auto-advance after showing result
      setTimeout(() => {
        setResult(null)
        setIsFlipped(false)
        onNext()
      }, 1500)
    } catch (error) {
      console.error('Erro ao enviar revisão:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Card with flip animation */}
      <div 
        className="relative h-80 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div 
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500 uppercase tracking-wide mb-4">Pergunta</span>
              <p className="text-2xl font-medium text-gray-900 text-center">{card.front}</p>
            </div>
            <div className="text-center text-sm text-gray-400">
              Clique para revelar a resposta
            </div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 bg-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col rotate-y-180 backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500 uppercase tracking-wide mb-4">Resposta</span>
              <p className="text-2xl font-medium text-gray-900 text-center">{card.back}</p>
            </div>
            <div className="text-center text-sm text-gray-400">
              {card.deck_title}
            </div>
          </div>
        </div>
      </div>

      {/* Quality buttons - only show when flipped */}
      {isFlipped && !result && (
        <div className="mt-6 grid grid-cols-4 gap-3">
          {DIFFICULTY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={(e) => {
                e.stopPropagation()
                handleReview(option.value)
              }}
              disabled={isSubmitting}
              className={`${option.color} text-white py-3 px-2 rounded-xl font-medium transition-all disabled:opacity-50 flex flex-col items-center`}
            >
              <span className="text-sm">{option.label}</span>
              <span className="text-xs opacity-80">{option.sublabel}</span>
            </button>
          ))}
        </div>
      )}

      {/* Result feedback */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
          <p className="text-green-800 font-medium">
            Próxima revisão: {new Date(result.next_review).toLocaleDateString('pt-BR')}
          </p>
          <p className="text-green-600 text-sm mt-1">
            Intervalo: {result.interval} dias • Repetições: {result.repetitions}
          </p>
        </div>
      )}

      {/* Submitting state */}
      {isSubmitting && (
        <div className="mt-6 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}
    </div>
  )
}
