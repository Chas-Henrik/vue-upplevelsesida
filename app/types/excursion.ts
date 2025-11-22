export interface Offer {
  id: string
  title: string
  price: number
}

export type Season = 'Winter' | 'Summer'

export type AgeCategory = 'Child 0-12' | 'Adult 13-64' | 'Senior 65+'

export interface ExcursionFilters {
  ageCategory?: AgeCategory
  season?: Season
}

export interface Excursion {
  id: string
  title: string
  season: Season
  price: number
  description: string
  details: string
  ageCategory: AgeCategory
  offers: readonly Offer[]
}

export interface ArticleFilters {
  season?: Season
  ageCategory?: AgeCategory
}

export interface Article {
  id: string
  title: string
  season: Season
  ageCategory: AgeCategory
  linkedExperienceId: string
  content: string
}