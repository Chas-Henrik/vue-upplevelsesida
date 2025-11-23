import type { AgeCategory, Excursion, Offer } from "./excursion";

export interface BookingField {
  name: string;
  ageCategory: AgeCategory
  excursionPrice: number
  selectedOffers: Offer[]
}

export interface BookingItem {
  excursion: Excursion
  person: BookingField
}

export interface Booking {
  excursionId: string
  title: string
  date: string
  duration: string
  numberOfPersons: number
  personBookingFields: BookingField[]
}
