<script setup lang="ts">
import type { Booking } from '~/types/booking'
import { useCartStore } from '~/stores/cart'
import BookingForm from '~/components/BookingForm.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const excursionId = computed(() => route.params.excursionId as string)

const handleSubmit = (booking: Booking) => {
  cartStore.addExcursion(booking)
  router.push('/cart')
}
</script>

<template>
  <div class="booking-page">
    <div class="container">
      <h1 class="page-title">Book Your Excursion</h1>
      <BookingForm 
        :excursion-id="excursionId" 
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