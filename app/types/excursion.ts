export interface Package {
  id: string
  title: string
  price: number
}

export interface Excursion {
  id: string
  title: string
  season: string
  price: number
  description: string
  packages: Package[]
}