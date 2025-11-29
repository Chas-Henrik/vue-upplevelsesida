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
    <div>
      <label class="mr-1 font-semibold">Date</label>
      <VueDatePicker 
        class="px-3 py-2.5 bg-primary/10 text-gray-800 font-semibold
               focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
        type="date"
        :formats="{  preview: 'yyyy.MM.dd', input: 'yyyy.MM.dd' }"
        :start-date="minDate"
        focus-start-date
        v-model="filters.date"
        :min-date="minDate"
        :time-config="{ enableTimePicker: false }"
        @update:model-value="updateFilters"
        style="border-radius: var(--radius-md)"
      />

      <svg 
    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
    viewBox="0 0 20 20" fill="currentColor"
  >
    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
  </svg>
    </div>

    <!-- DURATION -->
    <div class="relative">
      <label class="mr-1 font-semibold">Duration</label>
      <select
        v-model="filters.duration"
        @change="updateFilters"
        class="px-3 pr-10 py-2.5 bg-primary/10 text-gray-800 font-semibold
               focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
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
               focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
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
               focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
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
             hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
      style="border-radius: var(--radius-md)"
    >
      Reset Filters
    </button>
  </div>
</template>
