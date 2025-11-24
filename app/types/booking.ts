import type { AgeCategory, Excursion, Offer } from "./excursion";

export interface Booking {
  bookingId: string
  excursionId: string
  title: string
  date: string
  duration: string
  numberOfPersons: number
  bookingFields: BookingField[]
}

export interface BookingField {
  name: string;
  ageCategory: AgeCategory
  excursionPrice: number
  selectedOffers: Offer[]
}

export interface BookingItem {
  excursion: Excursion
  bookingField: BookingField
}
