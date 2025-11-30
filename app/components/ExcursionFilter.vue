<script setup lang="ts">
import { useRoute } from "vue-router"
import { useExcursions } from "~/composables/useExcursions"
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const emit = defineEmits(["update-filters", "reset"])
const route = useRoute()
const { getSortedExcursionDurations } = useExcursions()

const availableDurations = computed(() => getSortedExcursionDurations())



// STATE
const filters = ref({
  date: "",
  duration: "",
  noPersons: "",
  ageCategory: ""
})

// MIN DATE
const minDate = computed(() => {
  return formatLocalDate(new Date()) // Uses local time and today's date in YYYY-MM-DD format
})

// MAX DATE: 1 year from now, rounded down to next Sep 30 or Mar 31 (whichever comes first)
const maxDate = computed(() => {
  const today = new Date();
  const oneYearLater = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

  // Find the next Mar 31 and Sep 30 after today
  let nextMar31 = new Date(today.getFullYear(), 2, 31); // Mar 31 this year
  if (today > nextMar31) {
    nextMar31 = new Date(today.getFullYear() + 1, 2, 31); // Mar 31 next year
  }
  let nextSep30 = new Date(today.getFullYear(), 8, 30); // Sep 30 this year
  if (today > nextSep30) {
    nextSep30 = new Date(today.getFullYear() + 1, 8, 30); // Sep 30 next year
  }

  // Pick the latest of the two that is after today and within one year
  let candidates = [nextMar31, nextSep30].filter(d => d > today && d <= oneYearLater);
  let roundedMax;
  if (candidates.length > 0) {
    roundedMax = candidates.reduce((a, b) => (a > b ? a : b)); // Keep the latest date
  } else {
    // fallback: just use one year from today
    roundedMax = oneYearLater;
  }
  return formatLocalDate(roundedMax);
});

// LOAD QUERY INTO UI
onMounted(() => {
  filters.value.date = (route.query.date as string) || ""
  filters.value.duration = (route.query.duration as string) || ""
  filters.value.noPersons = route.query["no-persons"]
    ? String(route.query["no-persons"])
    : ""
  filters.value.ageCategory = (route.query["age-category"] as string) || ""

  emit("update-filters", normalizeFilters())
})


// NORMALIZE FILTERS
function normalizeFilters() {
  return {
    date: filters.value.date || null,
    duration: filters.value.duration || null,
    noPersons: filters.value.noPersons
      ? Number(filters.value.noPersons)
      : null,
    ageCategory: filters.value.ageCategory || null
  }
}

// UPDATE
function updateFilters() {
  emit("update-filters", normalizeFilters())
}

// RESET
function resetFilters() {
  filters.value = {
    date: "",
    duration: "",
    noPersons: "",
    ageCategory: ""
  }
  emit("reset")
}
</script>



<template>
  <div class="flex items-center gap-4 flex-wrap mb-5">

    <!-- DATE -->
    <label class="mr-1 font-semibold">Date</label>
    <div>
      <VueDatePicker 
        class="form-date-picker"
        :formats="{  preview: 'yyyy.MM.dd', input: 'yyyy.MM.dd' }"
        :start-date="minDate"
        focus-start-date
        v-model="filters.date"
        :min-date="minDate"
        :max-date="maxDate"
        :time-config="{ enableTimePicker: false }"
        @update:model-value="updateFilters"
        style="border-radius: var(--radius-md)"
      />
    </div>

    <!-- DURATION -->
    <div class="relative">
      <label class="mr-1 font-semibold">Duration</label>
      <select
        v-model="filters.duration"
        @change="updateFilters"
        class="px-3 pr-10 py-2.5 bg-primary/10 text-gray-800 font-semibold
               focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
        style="border-radius: var(--radius-md)"

      >
        <option value="">Any</option>
        <option 
          v-for="d in availableDurations" 
          :key="d" 
          :value="d"
        >{{ d }}</option>

      </select>

      <div class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center pointer-events-none">
        <svg 
          class="w-4 h-4 text-gray-600"
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- PERSONS -->
    <div class="relative inline-block">
      <label class="mr-1 font-semibold">Persons</label>
      <select
        v-model="filters.noPersons"
        @change="updateFilters"
        class="px-3 pr-10 py-2.5 bg-primary/10 text-gray-800 font-semibold
               focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
        style="border-radius: var(--radius-md)"
      >
        <option value="">Any</option>
        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
      </select>
      <div class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center pointer-events-none">
        <svg 
          class="w-4 h-4 text-gray-600"
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- AGE CATEGORY -->
    <div class="relative">
      <label class="mr-1 font-semibold">Age Category</label>
      <select
        v-model="filters.ageCategory"
        @change="updateFilters"
        class="px-3 pr-10 py-2.5 bg-primary/10 text-gray-800 font-semibold
               focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
        style="border-radius: var(--radius-md)"
      >
        <option value="">Any</option>
        <option value="Child 0-12">Child 0-12</option>
        <option value="Adult 13-64">Adult 13-64</option>
        <option value="Senior 65+">Senior 65+</option>
      </select>

      <div class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center pointer-events-none">
        <svg 
          class="w-4 h-4 text-gray-600"
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- RESET -->
    <button
      @click="resetFilters"
      class="px-4 py-2.5 text-white bg-[var(--color-primary)] font-semibold
             hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
      style="border-radius: var(--radius-md)"
    >
      Reset Filters
    </button>
  </div>
</template>

<style scoped>

/* VueDatePicker outer wrapper */
.form-date-picker {
  width: 10rem;
  height: 2.75rem;
  padding: 0;
  border-radius: var(--radius-md);
}

/* VueDatePicker input box */
.form-date-picker :deep(.dp__input) {
  height: 2.75rem;
  border: none;
  border-radius: var(--radius-md);
  display: block;              /* avoid inline quirks */
  box-sizing: border-box;
  font-weight: bold;
  font-size: 1rem;
  font-family: inherit;
  color: var(--color-gray-800);
  background-color: color-mix(in oklab, var(--color-primary) 10%, transparent);
}
</style>