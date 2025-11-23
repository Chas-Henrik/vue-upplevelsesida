import type { PersonBookingField } from "./booking"

export interface CartItem {
  excursionId: string
  title: string
  numberOfPersons: number
  startDate: string
  endDate: string
  personBookingFields: PersonBookingField[]
}

export interface Cart {
  items: CartItem[]
}
