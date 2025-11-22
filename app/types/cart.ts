export interface Person {
  name: string
  age: number
  selectedOffers: string[] // Offer IDs
}

export interface CartItem {
  excursionId: string
  numberOfPersons: number
  startDate: string
  endDate: string
  persons: Person[]
}

export interface Cart {
  items: CartItem[]
}
