export interface User {
  id: string
  email: string
  name: string
  streak_days: number
  last_study_date: string | null
}

export interface Deck {
  id: string
  title: string
  description: string
  is_public: boolean
  color: string
  card_count?: number
}

export interface Card {
  id: string
  deck_id: string
  front: string
  back: string
}

export interface DueCard {
  card_id: string
  front: string
  back: string
  deck_title: string
  interval: number
  repetitions: number
}

export interface ReviewResult {
  interval: number
  next_review: string
  easiness: number
  repetitions: number
}

export interface StudyStats {
  total_reviews: number
  current_streak: number
  cards_due_today: number
  cards_mastered: number
}
