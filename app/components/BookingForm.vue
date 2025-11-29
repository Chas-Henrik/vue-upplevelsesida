<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Booking, BookingField } from '~/types/booking'
import type { AgeCategory, Excursion } from '~/types/excursion'
import type { PropType } from 'vue'
import BookingFieldComponent from './BookingField.vue'
import { shortCryptoId, formatLocalDate } from '~/utils/helpers'
import { useExcursions } from "~/composables/useExcursions"
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const { excursions, loadExcursions, matchesSeason } = useExcursions()

const props = defineProps({
  excursionId: {
    type: String,
    required: false
  },
  date: {
    type: String,
    required: false,
    validator: (value: string) => {
      if (!value) return true // Allow undefined/empty
      const inputDate = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day
      return inputDate >= today
    }
  },
  noPersons: {
    type: Number,
    required: false,
    default: 1,
    validator: (value: number) => value >= 1 && value <= 10
  },
  ageCategory: {
    type: String as PropType<AgeCategory>,
    required: false,
    default: 'Adult 13-64',
    validator: (value: string) => ['Child 0-12', 'Adult 13-64', 'Senior 65+'].includes(value)
  }
})

const emit = defineEmits<{
  submit: [booking: Booking]
}>()

// Form state
const selectedExcursionId = ref<string>('')
const selectedDate = ref<string>(props.date || '')
const numberOfPersons = ref<number>(props.noPersons || 1)

// Booking fields data storage
const bookingFieldsData = ref<Map<number, BookingField>>(new Map())

// Load excursions on mount (as 'backup' if not already loaded by loadExcursions plugin)
onMounted(async () => {
  await loadExcursions()
  
  // Preselect excursion if excursionId provided by props exists and use first excursion otherwise
  if (props.excursionId && excursions.value.some(exc => exc.id === props.excursionId)) {
    selectedExcursionId.value = props.excursionId
  } else if (excursions.value.length > 0 && excursions.value[0]) {
    selectedExcursionId.value = excursions.value[0].id
  }
})

// Selected excursion computed
const selectedExcursion = computed<Excursion | undefined>(() => {
  return excursions.value.find(exc => exc.id === selectedExcursionId.value)
})

// Compute selectable date range based on selected excursion season & current date
const selectableDates = computed(() => {
  const season = selectedExcursion.value?.season;
  const today = new Date();
  const year = today.getFullYear();

  let start, end;

  if (season === "Winter") {
    const winterStartLastYear = new Date(year -1, 9, 1);      // Oct 1 last year
    const winterEnd           = new Date(year, 2, 31);        // Mar 31 this year
    const winterStart         = new Date(year, 9, 1);         // Oct 1 this year
    const winterEndNextYear   = new Date(year + 1, 2, 31);    // Mar 31 next year

    if (today < winterEnd) {
      // We are in the end of last years winter season
      start = winterStartLastYear;
      end = winterEnd;
    } else { 
      // Before or after winter starts this year
      start = winterStart;
      end = winterEndNextYear;
    }
  } else {
    const summerStart         = new Date(year, 3, 1);       // Apr 1 this year
    const summerEnd           = new Date(year, 8, 30);      // Sep 30 this year
    const summerStartNextYear = new Date(year + 1, 3, 1);   // Apr 1 next year
    const summerEndNextYear   = new Date(year + 1, 8, 30);  // Sep 30 next year

    if (today <= summerEnd) {
      // We are before or in this summer season
      start = summerStart;
      end = summerEnd;
    } else { 
      // After summer ends this year
      start = summerStartNextYear;
      end = summerEndNextYear;
    }
  }

  // If season already started, start from TODAY (local time)
  const min = formatLocalDate(today > start ? today : start);
  const max = formatLocalDate(end);

  return { start: min, end: max };
})

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
      const defaultAgeCategory = i === 0 ? props.ageCategory : ('Adult 13-64' as AgeCategory)
      fields.push({
        name: '',
        ageCategory: defaultAgeCategory,
        excursionPrice: selectedExcursion.value?.prices.find(p => p.ageCategory === defaultAgeCategory)?.price || 0,
        selectedOffers: []
      })
    }
  }
  
  return fields
})

// Compute total price
const totalPrice = computed(() => {
  return bookingFields.value.reduce((total, field) => {
    const fieldTotal = field.excursionPrice + field.selectedOffers.reduce((sum, offer) => sum + offer.price, 0)
    return total + fieldTotal
  }, 0)
})

// Validate form
const isFormValid = computed(() => {
  return selectedExcursionId.value !== '' &&
         selectedDate.value !== '' &&
         numberOfPersons.value >= 1 &&
         bookingFields.value.every(field => field.name.trim() !== '')
})

// Clear selected date if selectedExcursion is changed
watch(selectedExcursion, () => {
  // Clear selected date if out of season
  if(!(selectedExcursion.value && matchesSeason(selectedExcursion.value.season, selectedDate.value))) {
    selectedDate.value = ''
  }
  // Adjust number of persons if exceeding maxGroupSize
  if(selectedExcursion.value && selectedExcursion.value.maxGroupSize) {
     numberOfPersons.value = numberOfPersons.value > selectedExcursion.value.maxGroupSize ? selectedExcursion.value.maxGroupSize : 1
  }
})

// Handle booking field changes
const handleFieldChange = (index: number, updatedField: BookingField) => {
  bookingFieldsData.value.set(index, updatedField)
}

// Submit handler
const handleSubmit = () => {
  if (!isFormValid.value || !selectedExcursion.value) return
  
  // Build Booking object
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
          <VueDatePicker
            id="date"
            class="form-date-picker"
            :ui="{ input: 'form-date-picker-input' }"
            :formats="{  preview: 'yyyy.MM.dd', input: 'yyyy.MM.dd' }"
            :start-date="selectableDates.start"
            focus-start-date
            v-model="selectedDate"
            :min-date="selectableDates.start"
            :max-date="selectableDates.end"
            :time-config="{ enableTimePicker: false }"
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
            <option v-for="n in selectedExcursion ? selectedExcursion.maxGroupSize : 10" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Booking Fields -->
    <div v-if="selectedExcursion && bookingFields.length > 0" class="form-section">
      <h2 class="section-title">Participant Information</h2>
      <BookingFieldComponent
        v-for="(field, index) in bookingFields"
        :key="index"
        :excursion="selectedExcursion"
        :booking-field="field"
        :age-category="index === 0 ? ageCategory : undefined"
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
  height: 3rem;
}

/* VueDatePicker outer wrapper: */
.form-date-picker {
  width: 100%;
  height: 3rem;
  padding: 0;
  border: 1px solid #d1d5db;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: inherit;
  background: white;
}

/* VueDatePicker Input */
.form-date-picker-input {
  height: 100%;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: var(--radius-md);
  display: block;              /* avoid inline quirks */
  box-sizing: border-box;
  background-color: cyan;     /* debug */
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