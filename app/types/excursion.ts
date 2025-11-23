export interface Offer {
  id: string
  title: string
  price: number
}

export type Season = 'Winter' | 'Summer'

export type AgeCategory = 'Child 0-12' | 'Adult 13-64' | 'Senior 65+'

export interface PriceByAge {
  ageCategory: AgeCategory
  price: number
}

export interface ExcursionFilters {
  recommendedAge?: AgeCategory
  season?: Season
}

export interface Excursion {
  readonly id: string
  readonly title: string
  readonly season: Season
  readonly prices: readonly PriceByAge[]
  readonly description: string
  readonly details: string
  readonly recommendedAge: AgeCategory
  readonly duration: string
  readonly offers: readonly Offer[]
}

export interface ArticleFilters {
  season?: Season
  recommendedAge?: AgeCategory
}

export interface Article {
  readonly id: string
  readonly title: string
  readonly season: Season
  readonly recommendedAge: AgeCategory
  readonly linkedExcursionId: string
  readonly duration: string
  readonly content: string
}