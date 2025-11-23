import type { AgeCategory, Excursion, Offer } from "./excursion";

export interface PersonBookingField {
  name: string;
  ageCategory: AgeCategory
  excursionPrice: number
  selectedOffers: Offer[]
}

export interface PersonBookingItem {
  excursion: Excursion
  person: PersonBookingField
}