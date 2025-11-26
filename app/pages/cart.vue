<script setup lang="ts">
  import { useCartStore } from '~/stores/cart'
  import CartItem from '~/components/CartItem.vue'
  import type { Booking } from '~/types'
  
  const cartStore = useCartStore()

  const bookings = computed(() => cartStore.items)

  const baseTotal = computed(() => 
  cartStore.items.reduce((bookSum, book) => {
    return bookSum + book.bookingFields.reduce((fSum, field) => {
      const offerSum = field.selectedOffers.reduce((oSum, offer) => 
        oSum + offer.price
      , 0)
      return fSum + offerSum + field.excursionPrice
    }, 0)
  }, 0)
)

const vat = computed(() => baseTotal.value * 0.25)

const totalWithVat = computed(() => baseTotal.value + vat.value)


  function clearCart() {
    if (bookings.value.length > 0) {
        if (confirm('Are you sure you want to clear the cart?')) cartStore.clearCart()
        else return
    }
  }

  function handleDelete(booking: Booking) {
    if (!booking) return
    if (confirm(`Are you sure you want to remove the booking for ${booking.title} on ${booking.date}?`)) {
      cartStore.removeExcursion(booking.excursionId, booking.date)
    } else return
  } 

  function handleCheckout() {
    navigateTo("/confirmation")
  }

  let keyId = 0

</script>

<template>
  <div class="min-h-screen bg-bg p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-serif text-text mb-2">Shopping Cart</h1>
        <p class="text-gray-600 font-sans">{{ bookings.length }} {{ bookings.length === 1 ? 'item' : 'items' }} in your cart</p>
      </div>

      <!-- Cart items -->
      <div class="mb-8">
        <CartItem 
          v-for="booking in bookings"  
          :key="keyId++"
          :booking="booking"
          @click="handleDelete"
        />
        
        <!-- Empty state -->
        <div v-if="bookings.length === 0" class="text-center py-12 bg-white shadow-base" style="border-radius: var(--radius-lg)">
          <p class="text-lg font-sans text-gray-500 mb-6">Your cart is empty.</p>
          <NuxtLink to="/" class="inline-block bg-primary text-white px-6 py-3 font-sans font-semibold hover:bg-blue-900 transition-colors shadow-md hover:shadow-lg" style="border-radius: var(--radius-md)">
            Continue Shopping
          </NuxtLink>
        </div>
      </div>
      <div class="w-full pr-7 space-y-2">

<!-- Base price -->
<p class="flex justify-end w-full text-lg">
  <span class="font-medium">Price (excl. VAT):</span>
  <span class="flex self-end ml-2 font-sans font-semibold text-primary">
    {{ baseTotal }} SEK
  </span>
</p>

<!-- VAT 25% -->
<p class="flex justify-end w-full text-sm text-gray-600">
  <span class="font-normal">VAT (25%):</span>
  <span class="flex self-end ml-2 font-sans font-light text-primary">
    {{ vat }} SEK
  </span>
</p>

<!-- Total price including VAT -->
<h3 class="flex justify-end w-full text-xl mt-2">
  <span class="font-semibold">Total price:</span>
  <span class="flex self-end ml-2 font-sans font-bold text-primary">
    {{ totalWithVat }} SEK
  </span>
</h3>

</div>

      
      <!-- Actions -->
      <div v-if="bookings.length > 0" class="flex gap-4 mb-8">
        <button 
          type="button" 
          @click="clearCart"
          class="flex-1 bg-gray-200 text-text px-6 py-3 font-sans font-semibold hover:bg-gray-300 transition-colors cursor-pointer shadow-md hover:shadow-lg"
          style="border-radius: var(--radius-md)"
        >
          Clear Cart
        </button>
        <button 
          type="button" 
          class="flex-1 bg-secondary text-white px-6 py-3 font-sans font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-md"
          style="border-radius: var(--radius-md)"
          @click="handleCheckout"
        >
          Go to Checkout
        </button>
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

