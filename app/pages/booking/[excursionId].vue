<script setup lang="ts">
import type { Booking } from '~/types/booking'
import type { AgeCategory } from '~/types/excursion'
import { useCartStore } from '~/stores/cart'
import BookingForm from '~/components/BookingForm.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const excursionId = computed(() => route.params.excursionId as string)

// Extract query params with validation
const date = computed(() => {
  const value = route.query.date as string | undefined
  if (!value) return undefined
  const inputDate = new Date(value)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return inputDate >= today ? value : undefined
})

const noPersons = computed(() => {
  const value = route.query['no-persons']
  const num = value ? Number(value) : undefined
  return num && num >= 1 && num <= 10 ? num : undefined
})

const ageCategory = computed(() => {
  const value = route.query['age-category'] as string
  const validCategories: AgeCategory[] = ['Child 0-12', 'Adult 13-64', 'Senior 65+']
  return validCategories.includes(value as AgeCategory) ? value as AgeCategory : undefined
})

const handleSubmit = (booking: Booking) => {
  cartStore.addExcursion(booking)
  
  // Extract first person's age category
  const firstPersonAgeCategory = booking.bookingFields[0]?.ageCategory
  
  // Build query params
  const queryParams = new URLSearchParams({
    date: booking.date,
    duration: booking.duration,
    'no-persons': booking.numberOfPersons.toString()
  })
  
  if (firstPersonAgeCategory) {
    queryParams.append('age-category', firstPersonAgeCategory)
  }
  
  router.push(`/?${queryParams.toString()}`)
}
</script>

<template>
  <div class="booking-page">
    <div class="container">
      <h1 class="page-title">Book Your Excursion</h1>
      <BookingForm 
        :excursion-id="excursionId"
        :date="date"
        :no-persons="noPersons"
        :age-category="ageCategory"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<style scoped>
.booking-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
}
</style>