'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { studyService } from '@/services/study.service'
import { ArrowLeft, Palette } from 'lucide-react'
import Link from 'next/link'

const colorOptions = [
  { name: 'Azul', value: 'blue', bg: 'bg-blue-500', border: 'border-blue-500' },
  { name: 'Verde', value: 'green', bg: 'bg-green-500', border: 'border-green-500' },
  { name: 'Roxo', value: 'purple', bg: 'bg-purple-500', border: 'border-purple-500' },
  { name: 'Laranja', value: 'orange', bg: 'bg-orange-500', border: 'border-orange-500' },
  { name: 'Rosa', value: 'pink', bg: 'bg-pink-500', border: 'border-pink-500' },
  { name: 'Teal', value: 'teal', bg: 'bg-teal-500', border: 'border-teal-500' },
]

export default function NovoDeckPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Título é obrigatório')
      return
    }

    setLoading(true)
    setError('')

    try {
      await studyService.createDeck({
        title: title.trim(),
        description: description.trim(),
        color: selectedColor,
        is_public: false,
      })
      router.push('/meus-decks')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar deck')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/meus-decks"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Meus Decks
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Criar novo deck
        </h1>
        <p className="text-gray-600 mb-6">
          Crie um deck para organizar seus flashcards
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Inglês para viagem"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Vocabulário essencial para viagens"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Palette className="w-4 h-4 inline mr-2" />
              Cor do deck
            </label>
            <div className="flex gap-3 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-12 h-12 rounded-lg ${color.bg} transition-all ${
                    selectedColor === color.value
                      ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                      : 'hover:scale-105'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link
              href="/meus-decks"
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Criar deck'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
