export interface Package {
  id: string
  title: string
  price: number
}

export type AgeCategory = 'Child 0-12' | 'Adult 13-64' | 'Senior 65+'

export interface Excursion {
  id: string
  title: string
  season: string
  price: number
  description: string
  ageCategory: AgeCategory
  packages: Package[]
}