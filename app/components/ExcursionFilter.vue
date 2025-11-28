<script setup lang="ts">
import { useRoute } from "vue-router"
import { useExcursions } from "~/composables/useExcursions"

const emit = defineEmits(["update-filters", "reset"])
const route = useRoute()

const { getExcursionDurations } = useExcursions()
const availableDurations = computed(() => {
  return getExcursionDurations().slice().sort((a, b) => {

    const aIsDay = a.includes("day")
    const bIsDay = b.includes("day")

    if (aIsDay && !bIsDay) return 1
    if (!aIsDay && bIsDay) return -1 

    return parseInt(a) - parseInt(b)
  })
})


// STATE
const filters = ref({
  date: "",
  duration: "",
  noPersons: "",
  ageCategory: ""
})

// MIN DATE
const minDate = computed(() => {
  return new Date().toISOString().split("T")[0]
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
      <input 
        type="date"
        v-model="filters.date"
        :min="minDate"
        @change="updateFilters"
        class="px-3 py-2.5 bg-primary/10 text-gray-800 font-semibold
               focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
        style="border-radius: var(--radius-md)"
      />
    </div>

    <!-- DURATION -->
    <div class="relative">
      <label class="mr-1 font-semibold">Duration</label>
      <select
        v-model="filters.duration"
        @change="updateFilters"
        class="px-3 py-2.5 bg-primary/10 text-gray-800 font-semibold
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
    </div>

    <!-- PERSONS -->
    <div class="relative inline-block">
      <label class="mr-1 font-semibold">Persons</label>
      <select
        v-model="filters.noPersons"
        @change="updateFilters"
        class="px-3 pr-8 py-2.5 bg-primary/10 text-gray-800 font-semibold
               focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
        style="border-radius: var(--radius-md)"
      >
        <option value="">Any</option>
        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>

    <!-- AGE CATEGORY -->
    <div class="relative">
      <label class="mr-1 font-semibold">Age Category</label>
      <select
        v-model="filters.ageCategory"
        @change="updateFilters"
        class="px-3 py-2.5 bg-primary/10 text-gray-800 font-semibold
               focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
        style="border-radius: var(--radius-md)"
      >
        <option value="">Any</option>
        <option value="Child 0-12">Child 0-12</option>
        <option value="Adult 13-64">Adult 13-64</option>
        <option value="Senior 65+">Senior 65+</option>
      </select>
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
