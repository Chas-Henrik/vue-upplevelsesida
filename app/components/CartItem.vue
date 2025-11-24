<script setup lang="ts">

  import type { Booking } from '~/types'
  import { useExcursions } from '~/composables/useExcursions'

  interface Props {
    booking : Booking  
  }

  const props = defineProps<Props>()

  const { getExcursionById } = useExcursions()

  const excursion = getExcursionById(props.booking.excursionId)!

  const emit = defineEmits<{
    click: [booking: Booking] 
  }>()

  const bookingFields = props.booking.bookingFields.map(field => {
    return {
      ...field,
      keyId: crypto.randomUUID(),
    } 
  })   

  const totalPrice = computed(() => {
    return bookingFields.reduce((total, field) => {
      const fieldTotal = field.excursionPrice + field.selectedOffers.reduce((sum, offer) => sum + offer.price, 0)
      return total + fieldTotal
  }, 0)
})

</script>

<template>
  <div class="bg-white shadow-md hover:shadow-lg transition-shadow mb-4" style="border-radius: var(--radius-lg)">
    <!-- Header with title and remove button -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <h2 class="text-xl font-serif text-text">{{ excursion.title }}</h2>
      <button 
        type="button" 
        @click="$emit('click', props.booking)"
        class="inline-flex items-center justify-center w-8 h-8 text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer font-semibold"
        style="border-radius: var(--radius-md)"
        aria-label="Remove from cart"
      >
        ×
      </button>
    </div>

    <!-- Booking details -->
    <div class="p-6">
      <!-- Basic Info -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-bg p-3" style="border-radius: var(--radius-md)">
          <p class="text-xs text-gray-500 font-sans mb-1">Date</p>
          <p class="font-sans font-semibold text-text">{{ props.booking.date }}</p>
        </div>
        <div class="bg-bg p-3" style="border-radius: var(--radius-md)">
          <p class="text-xs text-gray-500 font-sans mb-1">Persons</p>
          <p class="font-sans font-semibold text-text">{{ props.booking.numberOfPersons }}</p>
        </div>
        <div class="bg-primary/10 p-3" style="border-radius: var(--radius-md)">
          <p class="text-xs text-gray-500 font-sans mb-1">Total</p>
          <p class="font-sans font-semibold text-primary text-lg">{{ totalPrice }} SEK</p>
        </div>
      </div>

      <!-- Persons breakdown -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-sm font-serif font-semibold text-text mb-4">Participants</h3>
        <ul class="space-y-3">
          <li v-for="person in bookingFields" :key="person.keyId" class="p-4 bg-gray-50" style="border-radius: var(--radius-md)">
            <!-- Person header -->
            <div class="flex items-center justify-between mb-3">
              <div>
                <p class="font-sans font-semibold text-text">{{ person.name }}</p>
                <p class="text-xs text-gray-500 font-sans">{{ person.ageCategory }}</p>
              </div>
              <span class="font-sans font-semibold text-primary">{{ person.excursionPrice }} SEK</span>
            </div>

            <!-- Offers section -->
            <div v-if="person.selectedOffers.length > 0" class="mt-3 pt-3 border-t border-gray-200">
              <p class="text-xs font-sans font-semibold text-gray-600 mb-2">Add-ons:</p>
              <ul class="space-y-2">
                <li v-for="offer in person.selectedOffers" :key="offer.id" class="flex items-center justify-between text-sm">
                  <span class="font-sans text-gray-700">{{ offer.title }}</span>
                  <span class="font-sans text-primary font-semibold">+{{ offer.price }} SEK</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions for interactive elements */
  button {
    transition: all 0.2s ease;
  }
</style>