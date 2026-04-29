import api from '@/lib/api'
import { DueCard, ReviewResult, StudyStats, Deck } from '@/types'

export interface ReviewData {
  card_id: string
  quality: number
}

export const studyService = {
  async getDueCards(): Promise<DueCard[]> {
    const response = await api.get<DueCard[]>('/study/due/')
    return response.data
  },

  async submitReview(card_id: string, quality: number): Promise<ReviewResult> {
    const response = await api.post<ReviewResult>('/study/review/', {
      card_id,
      quality,
    })
    return response.data
  },

  async getStats(): Promise<StudyStats> {
    const response = await api.get<StudyStats>('/study/stats/')
    return response.data
  },

  async getDecks(): Promise<Deck[]> {
    const response = await api.get<Deck[]>('/decks/')
    return response.data
  },
}

