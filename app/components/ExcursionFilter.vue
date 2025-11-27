<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"

const emit = defineEmits(["update:filters", "reset"])
const route = useRoute()

const filters = ref({
  date: "",
  duration: "",
  noPersons: "",
  ageCategory: ""
})

const today = new Date().toISOString().split("T")[0]!
const dateError = ref("")

onMounted(() => {
  filters.value.date = (route.query.date as string) || ""
  filters.value.duration = (route.query.duration as string) || ""
  filters.value.noPersons = route.query["no-persons"]
    ? String(route.query["no-persons"])
    : ""
  filters.value.ageCategory = (route.query["age-category"] as string) || ""

  emit("update:filters", filters.value)
})

function onDateChange() {
  const chosen = filters.value.date

  if (!chosen) {
    dateError.value = ""
    emit("update:filters", filters.value)
    return
  }

  const selected = new Date(chosen + "T00:00")
  const min = new Date(today)

  if (selected < min) {
    dateError.value = "You cannot select a date in the past."
    return
  }

  dateError.value = ""
  emit("update:filters", filters.value)
}

function updateFilters() {
  emit("update:filters", filters.value)
}

function resetFilters() {
  filters.value = {
    date: "",
    duration: "",
    noPersons: "",
    ageCategory: ""
  }
  dateError.value = ""
  emit("reset")
}
</script>

<template>
  <div class="flex items-center gap-4 flex-wrap mb-5">

    <!-- DATE -->
    <div>
      <label class="mr-1 font-semibold">Date</label>
      <input 
        type="date"
        v-model="filters.date"
        @input="onDateChange"
        :min="today"
        class="px-5 py-2.5 rounded-full bg-gray-200 text-gray-700 font-medium"
      />

      <p v-if="dateError" class="text-red-500 text-sm mt-1">
        {{ dateError }}
      </p>
    </div>

    <!-- DURATION -->
    <div class="relative">
      <label class="mr-1 font-semibold">Duration</label>
      <select
        v-model="filters.duration"
        @change="updateFilters"
        class="px-5 py-2.5 rounded-full bg-gray-200 text-gray-700 font-medium pr-10 appearance-none"
      >
        <option value="">Any</option>
        <option value="2h">2h</option>
        <option value="3h">3h</option>
        <option value="4h">4h</option>
        <option value="6h">6h</option>
        <option value="8h">8h</option>
        <option value="2 days">2 days</option>
      </select>

      <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
      </svg>
    </div>

    <!-- PERSONS -->
    <div class="relative">
      <label class="mr-1 font-semibold">Persons</label>
      <select
        v-model="filters.noPersons"
        @change="updateFilters"
        class="px-5 py-2.5 rounded-full bg-gray-200 text-gray-700 font-medium pr-10 appearance-none"
      >
        <option value="">Any</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>

      <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
      </svg>
    </div>

    <!-- AGE CATEGORY -->
    <div class="relative">
      <label class="mr-1 font-semibold">Age Category</label>
      <select
        v-model="filters.ageCategory"
        @change="updateFilters"
        class="px-5 py-2.5 rounded-full bg-gray-200 text-gray-700 font-medium pr-10 appearance-none"
      >
        <option value="">Any</option>
        <option value="Child 0-12">Child 0-12</option>
        <option value="Adult 13-64">Adult 13-64</option>
        <option value="Senior 65+">Senior 65+</option>
      </select>

      <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
      </svg>
    </div>

    <!-- RESET -->
    <div class="flex items-end">
      <button
        class="bg-[var(--color-primary)] ml-auto px-4 py-2 rounded-full font-medium text-white"
        @click="resetFilters"
      >
        Reset Filters
      </button>
    </div>

  </div>
</template>
