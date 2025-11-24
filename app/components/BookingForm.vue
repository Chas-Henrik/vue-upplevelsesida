<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Booking, BookingField, BookingItem } from '~/types/booking'
import type { Excursion } from '~/types/excursion'
import BookingFieldComponent from './BookingField.vue'
import { shortCryptoId } from '~/utils/helpers'

interface Props {
  excursionId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [booking: Booking]
}>()

const { excursions, loadExcursions } = useExcursions()

// Form state
const selectedExcursionId = ref<string>('')
const selectedDate = ref<string>('')
const numberOfPersons = ref<number>(1)

// Selected excursion computed
const selectedExcursion = computed<Excursion | undefined>(() => {
  return excursions.value.find(exc => exc.id === selectedExcursionId.value)
})

// Booking fields data storage
const bookingFieldsData = ref<Map<number, BookingField>>(new Map())

// Computed booking fields based on number of persons
const bookingFields = computed<BookingField[]>(() => {
  const fields: BookingField[] = []
  
  for (let i = 0; i < numberOfPersons.value; i++) {
    // Get existing data or create new field
    const existing = bookingFieldsData.value.get(i)
    
    if (existing) {
      // Update price if excursion changed
      fields.push({
        ...existing,
        excursionPrice: selectedExcursion.value?.prices.find(p => p.ageCategory === existing.ageCategory)?.price || 0
      })
    } else {
      // Create new field with default values
      fields.push({
        name: '',
        ageCategory: 'Adult 13-64',
        excursionPrice: selectedExcursion.value?.prices.find(p => p.ageCategory === 'Adult 13-64')?.price || 0,
        selectedOffers: []
      })
    }
  }
  
  return fields
})

// Create BookingItem for each person
const bookingItems = computed<BookingItem[]>(() => {
  if (!selectedExcursion.value) return []
  
  return bookingFields.value.map(field => ({
    excursion: selectedExcursion.value!,
    bookingField: field
  }))
})

// Handle booking field changes
const handleFieldChange = (index: number, updatedField: BookingField) => {
  bookingFieldsData.value.set(index, updatedField)
}

// Compute total price
const totalPrice = computed(() => {
  return bookingFields.value.reduce((total, field) => {
    const fieldTotal = field.excursionPrice + field.selectedOffers.reduce((sum, offer) => sum + offer.price, 0)
    return total + fieldTotal
  }, 0)
})

// Form validation
const isFormValid = computed(() => {
  return selectedExcursionId.value !== '' &&
         selectedDate.value !== '' &&
         numberOfPersons.value >= 1 &&
         bookingFields.value.every(field => field.name.trim() !== '')
})

// Submit handler
const handleSubmit = () => {
  if (!isFormValid.value || !selectedExcursion.value) return
  
  const booking: Booking = {
    bookingId: shortCryptoId(),
    excursionId: selectedExcursion.value.id,
    title: selectedExcursion.value.title,
    date: selectedDate.value,
    duration: selectedExcursion.value.duration,
    numberOfPersons: numberOfPersons.value,
    bookingFields: bookingFields.value
  }
  
  emit('submit', booking)
}

// Get minimum date (today)
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Load excursions on mount
onMounted(async () => {
  await loadExcursions()
  
  // Preselect excursion if provided
  if (props.excursionId && excursions.value.some(exc => exc.id === props.excursionId)) {
    selectedExcursionId.value = props.excursionId
  } else if (excursions.value.length > 0 && excursions.value[0]) {
    selectedExcursionId.value = excursions.value[0].id
  }
})
</script>

<template>
  <div class="booking-form">
    <div class="form-section">
      <h2 class="section-title">Excursion Details</h2>
      
      <!-- Excursion Selection -->
      <div class="form-group">
        <label for="excursion" class="form-label">Select Excursion</label>
        <select
          id="excursion"
          v-model="selectedExcursionId"
          class="form-select"
          required
        >
          <option value="" disabled>Choose an excursion</option>
          <option v-for="excursion in excursions" :key="excursion.id" :value="excursion.id">
            {{ excursion.title }}
          </option>
        </select>
      </div>

      <!-- Date Selection -->
      <div class="form-row">
        <div class="form-group">
          <label for="date" class="form-label">Date</label>
          <input
            id="date"
            v-model="selectedDate"
            type="date"
            class="form-input"
            :min="minDate"
            required
          />
        </div>

        <!-- Duration (readonly) -->
        <div class="form-group">
          <label for="duration" class="form-label">Duration</label>
          <input
            id="duration"
            :value="selectedExcursion?.duration || 'Select an excursion'"
            type="text"
            class="form-input"
            readonly
            disabled
          />
        </div>

        <!-- Number of Persons -->
        <div class="form-group">
          <label for="persons" class="form-label">Number of Persons</label>
          <select
            id="persons"
            v-model.number="numberOfPersons"
            class="form-select"
            required
          >
            <option :value="1">1</option>
            <option :value="2">2</option>
            <option :value="3">3</option>
            <option :value="4">4</option>
            <option :value="5">5</option>
            <option :value="6">6</option>
            <option :value="7">7</option>
            <option :value="8">8</option>
            <option :value="9">9</option>
            <option :value="10">10</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Booking Fields -->
    <div v-if="selectedExcursion && bookingItems.length > 0" class="form-section">
      <h2 class="section-title">Participant Information</h2>
      <BookingFieldComponent
        v-for="(item, index) in bookingItems"
        :key="index"
        :booking-item="item"
        :index="index"
        @change="(updatedField) => handleFieldChange(index, updatedField)"
      />
    </div>

    <!-- Total Price -->
    <div v-if="selectedExcursion" class="form-section total-section">
      <div class="total-price">
        <span class="total-label">Total Price:</span>
        <span class="total-value">{{ totalPrice }} SEK</span>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="form-actions">
      <button
        type="button"
        class="btn btn-primary btn-large"
        :disabled="!isFormValid"
        @click="handleSubmit"
      >
        Add to Cart
      </button>
    </div>
  </div>
</template>

<style scoped>
.booking-form {
  max-width: 1200px;
  margin: 0 auto;
}

.form-section {
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-md);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
}

.form-input:disabled {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.form-input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.form-input[type="number"]::-webkit-outer-spin-button,
.form-input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.total-section {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid var(--color-primary);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 0;
  gap: 1rem;
}

.total-label {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
}

.total-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.form-actions {
  text-align: center;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-align: center;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1e3a8a;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-large {
  padding: 1rem 3rem;
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .booking-form {
    padding: 0 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .form-section {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .total-label {
    font-size: 1.25rem;
  }

  .total-value {
    font-size: 1.5rem;
  }

  .btn-large {
    width: 100%;
    padding: 1rem 2rem;
  }
}
</style>