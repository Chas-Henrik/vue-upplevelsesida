<script setup>
  import { useCartStore } from '~/stores/cart';
  import { computed } from 'vue';

  const cartStore = useCartStore();
  const bookings = ref([])

  onMounted(() => {
    bookings.value = [...cartStore.items]
    // cartStore.clearCart()
  })

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
  <div class="confirmation-page">
    <div class="container success-container">

      <!-- BIG GREEN CHECKMARK -->
      <div class="success-icon">
        ✓
      </div>

      <h1 class="success-title">Thank you for your payment</h1>
      <p class="success-lead">Your booking has been completed successfully. Below is a summary of your purchase.</p>

      <div v-if="bookings.length === 0" class="empty">
        <p>Your cart is empty.</p>
        <a class="btn" href="/">Back to home</a>
      </div>

      <div v-else class="order-list">
        <section class="orders">
          <details
            v-for="(b, idx) in bookings"
            :key="b.bookingId || idx"
            class="order"
            open
          >
            <summary class="order-summary">
              <div class="summary-left">
                <div class="order-title">{{ b.title }}</div>
                <div class="order-meta">{{ b.date }} · {{ b.numberOfPersons }} person(s)</div>
              </div>

              <div class="summary-right">
                <div class="order-subtotal">
                  {{ 
                    b.bookingFields.reduce(
                      (sum, f) => sum + f.excursionPrice + 
                        (f.selectedOffers || []).reduce((s, o) => s + (o.price || 0), 0), 
                      0
                    ) 
                  }} SEK
                </div>
              </div>
            </summary>

            <div class="order-details">
              <ul class="persons">
                <li v-for="(f, i) in b.bookingFields" :key="i" class="person">
                  <div class="person-info">
                    <div class="person-name">{{ f.name || 'No name provided' }}</div>
                    <div class="person-age">{{ f.ageCategory }}</div>
                  </div>

                  <div class="person-pricing">
                    <div class="base-price">Base price: <strong>{{ f.excursionPrice }} SEK</strong></div>

                    <div v-if="f.selectedOffers && f.selectedOffers.length" class="offers">
                      <small>Add-ons:</small>
                      <ul class="offer-list">
                        <li v-for="o in f.selectedOffers" :key="o.id">
                          {{ o.title }} (+{{ o.price }} SEK)
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </details>
        </section>

        <div class="total-row">
          <div class="total-label">Total amount:</div>
          <div class="total-amount">{{ totalPrice }} SEK</div>
        </div>

        <div class="actions">
          <button class="btn" @click="window.print()">Print receipt</button>
          <a class="btn btn-primary" href="/">Continue shopping</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { max-width:900px; margin:2rem auto; padding:1rem; }

/* SUCCESS HEADER SECTION */
.success-container {
  text-align:center;
  padding-top:1rem;
}

.success-icon {
  width:80px;
  height:80px;
  margin:0 auto 1rem auto;
  border-radius:50%;
  background:#22c55e33; /* soft green background */
  color:#22c55e;
  font-size:3.5rem;
  font-weight:900;
  display:flex;
  align-items:center;
  justify-content:center;
}

.success-title {
  font-size:1.8rem;
  margin-bottom:0.5rem;
  font-weight:800;
  color:#065f46;
}

.success-lead {
  color:#374151;
  margin-bottom:1.5rem;
  font-size:1.1rem;
}

.empty { text-align:center; padding:2rem 0; color:#374151; }

.order-list { margin-top:1rem; }

/* ORDER BOXES */
.order {
  background:#fff;
  border:1px solid #e5e7eb;
  border-radius:8px;
  margin-bottom:1rem;
  overflow:hidden;
}

.order-summary {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:1rem;
  padding:1rem;
  cursor:pointer;
}

.summary-left { display:flex; flex-direction:column; gap:0.25rem; align-items: start; }
.order-title { font-weight:700; font-size:1.1rem; }
.order-meta { color:#6b7280; font-size:0.9rem; }

.summary-right { min-width:110px; text-align:right; }
.order-subtotal { font-weight:700; color:var(--color-primary); }

/* PERSONS LIST */
.order-details { padding:0 1rem 1rem 1rem; border-top:1px solid #f3f4f6; }

.persons { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.75rem; }

.person {
  display:flex;
  justify-content:space-between;
  gap:1rem;
  padding:0.75rem 0;
  border-top:1px dashed #eef2f7;
}
.person:first-child {
  border-top:none;
  padding-top:0.5rem;
}

.person-info { max-width:60%; display: flex; flex-direction: column; align-items: flex-start; }
.person-name { font-weight:600; }
.person-age { color:#6b7280; font-size:0.9rem; }

.person-pricing { text-align:right; min-width:140px; }
.base-price { margin-bottom:0.4rem; }

.offers { text-align:right; font-size:0.9rem; color:#374151; }
.offers ul { margin:0.25rem 0 0 0; padding-left:1rem; text-align:left; display:inline-block; display: flex; flex-direction: column; align-items: flex-end; }

/* TOTAL */
.total-row {
  display:flex;
  justify-content:flex-end;
  gap:1rem;
  align-items:center;
  margin-top:1rem;
  padding:0 1rem;
}

.total-label { color:#374151; font-weight:700; }
.total-amount { font-size:1.25rem; font-weight:800; color:var(--color-primary); }

/* BUTTONS */
.actions {
  margin-top:1rem;
  display:flex;
  gap:0.75rem;
  justify-content:flex-end;
  padding:0 1rem 1rem 1rem;
}

.btn {
  padding:0.6rem 1rem;
  border-radius:6px;
  border:1px solid #e5e7eb;
  background:white;
  cursor:pointer;
  text-decoration:none;
  display:inline-flex;
  align-items:center;
}

.btn-primary {
  background:var(--color-primary);
  color:white;
  border-color:transparent;
}

/* MOBILE */
@media (max-width:768px) {
  .order-summary { flex-direction:column; align-items:flex-start; }
  .summary-right { width:100%; text-align:left; }
  .person { flex-direction:column; align-items:flex-start; }
  .person-pricing { text-align:left; }
  .actions { justify-content:center; flex-wrap:wrap; }
  .offers { display:flex; flex-direction:column; align-items:flex-start; }
  .offers ul { align-items:flex-start; padding-left: 0 };
}
</style>
