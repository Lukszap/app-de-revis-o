import api from '@/lib/api'
import { DueCard, ReviewResult, StudyStats, Deck, Card } from '@/types'

export interface ReviewData {
  card_id: string
  button_pressed: number  // 1-4 (Errei, Difícil, Bom, Fácil)
}

export interface CreateDeckData {
  title: string
  description: string
  color: string
  is_public: boolean
}

export interface CreateCardData {
  front: string
  back: string
}

export const studyService = {
  async getDueCards(): Promise<DueCard[]> {
    const response = await api.get<DueCard[]>('/study/due')
    return response.data
  },

  async submitReview(card_id: string, button_pressed: number): Promise<ReviewResult> {
    const response = await api.post<ReviewResult>('/study/review', {
      card_id,
      button_pressed,
    })
    return response.data
  },

  async getStats(): Promise<StudyStats> {
    const response = await api.get<StudyStats>('/study/stats')
    return response.data
  },

  async getNewCards(): Promise<DueCard[]> {
    const response = await api.get<DueCard[]>('/study/new')
    return response.data
  },

  async getDecks(): Promise<Deck[]> {
    const response = await api.get<Deck[]>('/decks')
    return response.data
  },

  async createDeck(data: CreateDeckData): Promise<Deck> {
    const response = await api.post<Deck>('/decks', data)
    return response.data
  },

  async getDeck(id: string): Promise<Deck> {
    const response = await api.get<Deck>(`/decks/${id}`)
    return response.data
  },

  async deleteDeck(id: string): Promise<void> {
    await api.delete(`/decks/${id}`)
  },

  async getCards(deckId: string): Promise<Card[]> {
    const response = await api.get<Card[]>(`/decks/${deckId}/cards`)
    return response.data
  },

  async createCard(deckId: string, data: CreateCardData): Promise<Card> {
    const response = await api.post<Card>(`/decks/${deckId}/cards`, data)
    return response.data
  },
}

