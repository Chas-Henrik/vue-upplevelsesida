<script setup>
  import { useCartStore } from '~/stores/cart';
  import { computed } from 'vue';

  const cartStore = useCartStore();

  const bookings = computed(() => cartStore.items);

  const totalPrice = computed(() =>
  bookings.value.reduce((total, booking) => {
    return total + booking.bookingFields.reduce((fieldTotal, field) => {
      const offerSum = field.selectedOffers.reduce((offerTotal, offer) => offerTotal + offer.price, 0);
        return fieldTotal + offerSum + field.excursionPrice
      }, 0);
    }, 0)
  ); 
  
</script>

<template>
  <div>
    <h1>Confirmation</h1>
    <p>{{ totalPrice }} kr</p>
  </div>
</template>
