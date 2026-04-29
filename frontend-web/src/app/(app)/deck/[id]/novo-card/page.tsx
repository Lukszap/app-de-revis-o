'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { studyService } from '@/services/study.service'
import { ArrowLeft, Plus, HelpCircle, Lightbulb } from 'lucide-react'
import Link from 'next/link'

export default function NovoCardPage() {
  const router = useRouter()
  const params = useParams()
  const deckId = params.id as string

  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!front.trim() || !back.trim()) {
      setError('Preencha a frente e o verso do card')
      return
    }

    setLoading(true)
    setError('')

    try {
      await studyService.createCard(deckId, {
        front: front.trim(),
        back: back.trim(),
      })
      router.push(`/deck/${deckId}`)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar card')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/deck/${deckId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o deck
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Adicionar novo card
        </h1>
        <p className="text-gray-600 mb-6">
          Crie um flashcard com pergunta e resposta
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="front" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              Frente (Pergunta) *
            </label>
            <textarea
              id="front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Ex: Qual é a capital do Brasil?"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Digite a pergunta ou o conteúdo que você quer memorizar
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-gray-400 rotate-90" />
            </div>
          </div>

          <div>
            <label htmlFor="back" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Lightbulb className="w-4 h-4 text-green-500" />
              Verso (Resposta) *
            </label>
            <textarea
              id="back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Ex: Brasília"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Digite a resposta ou a explicação
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Link
              href={`/deck/${deckId}`}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {loading ? 'Criando...' : 'Criar card'}
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Dica</h4>
          <p className="text-sm text-blue-700">
            Cards com perguntas claras e respostas objetivas são mais fáceis de memorizar.
            Evite colocar muita informação em um único card.
          </p>
        </div>
      </div>
    </div>
  )
}
