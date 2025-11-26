<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { BookingField } from '~/types/booking'
import type { AgeCategory, Excursion } from '~/types/excursion'
import type { PropType } from 'vue'

const props = defineProps({
  excursion: {
    type: Object as PropType<Excursion>,
    required: true
  },
  bookingField: {
    type: Object as PropType<BookingField>,
    required: true
  },
  ageCategory: {
    type: String as PropType<AgeCategory>,
    required: false,
    default: 'Adult 13-64',
    validator: (value: string) => ['Child 0-12', 'Adult 13-64', 'Senior 65+'].includes(value)
  },
  index: {
    type: Number,
    required: true
  }
})

const emit = defineEmits<{
  change: [bookingField: BookingField]
}>()

// Initialize reactive state from bookingField (use ageCategory prop as override for default)
const name = ref(props.bookingField.name)
const selectedAgeCategory = ref<AgeCategory>(props.ageCategory || props.bookingField.ageCategory)
const selectedOfferIds = ref<string[]>(
  props.bookingField.selectedOffers.map(offer => offer.id)
)

// Watch for excursion changes (by watching excursion.id)
watch(() => props.excursion.id, () => {
  name.value = props.bookingField.name
  selectedAgeCategory.value = props.ageCategory || props.bookingField.ageCategory
  selectedOfferIds.value = props.bookingField.selectedOffers.map(offer => offer.id)
})

// Available age categories
const ageCategories: AgeCategory[] = ['Child 0-12', 'Adult 13-64', 'Senior 65+']

// Compute excursion price based on selected age category
const excursionPrice = computed(() => {
  const priceObj = props.excursion.prices.find(
    p => p.ageCategory === selectedAgeCategory.value
  )
  return priceObj?.price || 0
})

// Get selected offer objects from IDs
const selectedOffers = computed(() => {
  return props.excursion.offers.filter(
    offer => selectedOfferIds.value.includes(offer.id)
  )
})

// Handle offer checkbox toggle
const toggleOffer = (offerId: string) => {
  const index = selectedOfferIds.value.indexOf(offerId)
  if (index > -1) {
    selectedOfferIds.value.splice(index, 1)
  } else {
    selectedOfferIds.value.push(offerId)
  }
}

// Emit updated BookingField whenever any field changes
const emitChange = () => {
  const bookingField: BookingField = {
    name: name.value,
    ageCategory: selectedAgeCategory.value,
    excursionPrice: excursionPrice.value,
    selectedOffers: selectedOffers.value
  }
  emit('change', bookingField)
}

// Watch for changes and emit
watch([name, selectedAgeCategory, selectedOfferIds], () => {
  emitChange()
}, { deep: true })
</script>

<template>
  <div class="booking-field">
    <div class="booking-field-header">
      <h3>Person {{ index + 1 }}</h3>
    </div>
    
    <div class="booking-field-content">
      <div class="form-row">
        <!-- Name Input -->
        <div class="form-group">
          <label :for="`name-${index}`" class="form-label">Name</label>
          <input
            :id="`name-${index}`"
            v-model="name"
            type="text"
            class="form-input"
            placeholder="Enter full name"
            required
          />
        </div>

        <!-- Age Category Selection -->
        <div class="form-group">
          <label :for="`age-category-${index}`" class="form-label">Age Category</label>
          <select
            :id="`age-category-${index}`"
            v-model="selectedAgeCategory"
            class="form-select"
            required
          >
            <option v-for="category in ageCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <div class="price-info">
            Price: {{ excursionPrice }} SEK
          </div>
        </div>
      </div>

      <!-- Offers Selection -->
      <div v-if="excursion.offers.length > 0" class="form-group">
        <label class="form-label">Add-ons (optional)</label>
        <div class="offers-list">
          <div
            v-for="offer in excursion.offers"
            :key="offer.id"
            class="offer-item"
          >
            <label class="offer-checkbox">
              <input
                type="checkbox"
                :checked="selectedOfferIds.includes(offer.id)"
                @change="toggleOffer(offer.id)"
              />
              <span class="offer-label">
                <span class="offer-title">{{ offer.title }}</span>
                <span class="offer-price">+{{ offer.price }} SEK</span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-field {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 1rem;
  transition: border-color 0.2s ease;
}

.booking-field:hover {
  border-color: var(--color-primary);
}

.booking-field-header {
  background: var(--color-primary);
  color: white;
  padding: 1rem 1.5rem;
}

.booking-field-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.booking-field-content {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-row .form-group {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  font-size: 0.9375rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s ease;
  background: white;
  height: 3rem;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

.price-info {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
}

.offers-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 0.75rem;
}

.offer-item {
  background: var(--color-bg);
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-md);
  padding: 0.75rem;
  transition: background 0.2s ease;
  min-width: 300px;
}

.offer-item:hover {
  background: #f3f4f6;
}

.offer-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
}

.offer-checkbox input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  margin-right: 0.75rem;
  flex-shrink: 0;
  accent-color: var(--color-primary);
}

.offer-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  gap: 1rem;
}

.offer-title {
  font-weight: 500;
  color: var(--color-text);
}

.offer-price {
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .offers-list {
    grid-template-columns: 1fr;
  }

  .offer-item {
    min-width: 0;
  }

  .booking-field-content {
    padding: 1rem;
  }

  .booking-field-header {
    padding: 0.75rem 1rem;
  }

  .booking-field-header h3 {
    font-size: 1rem;
  }
}
</style>
