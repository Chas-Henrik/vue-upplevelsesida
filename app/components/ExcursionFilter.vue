<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const emit = defineEmits(["update:filters"]);
const route = useRoute();

// Filter State
const filters = ref({
  date: "",
  duration: "",
  noPersons: "",
  ageCategory: ""
});

// Load filter from query params on mount
onMounted(() => {
  filters.value.date = (route.query.date as string) || "";
  filters.value.duration = (route.query.duration as string) || "";
  filters.value.noPersons = route.query["no-persons"]
    ? String(route.query["no-persons"])
    : "";
  filters.value.ageCategory = (route.query["age-category"] as string) || "";

  emit("update:filters", filters.value);
});


function updateFilters() {
  emit("update:filters", filters.value);
}


function resetFilters() {
  filters.value = {
    date: "",
    duration: "",
    noPersons: "",
    ageCategory: ""
  };
  emit("update:filters", filters.value);
}
</script>

<template>
  <div class="flex items-center gap-4 flex-wrap mb-5">

<!-- Date -->
<div>
  <label class="mr-1 font-semibold">Date</label>
  <input 
    type="date"
    class="px-5 py-2.5 rounded-full bg-gray-200 text-gray-700 font-medium 
           focus:outline-none appearance-none"
  />
</div>

<!-- Duration -->
<div class="relative">
  <label class="mr-1 font-semibold">Duration</label>
  <select
    class="px-5 py-2.5 rounded-full bg-gray-200 text-gray-700 font-medium
           pr-10 focus:outline-none appearance-none"
  >
    <option>Any</option>
    <option>3h</option>
    <option>4h</option>
    <option>6h</option>
  </select>

  <!-- FIXED SVG -->
  <svg 
    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
    viewBox="0 0 20 20" fill="currentColor"
  >
    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
  </svg>
</div>

<!-- Persons -->
<div class="relative">
  <label class="mr-1 font-semibold">Persons</label>
  <select class="px-5 py-2.5 rounded-full bg-gray-200 text-gray-700 font-medium pr-10 focus:outline-none appearance-none">
    <option>Any</option>
    <option>1</option>
    <option>2</option>
    <option>10</option>
  </select>

  <!-- FIXED SVG -->
  <svg 
    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
    viewBox="0 0 20 20" fill="currentColor"
  >
    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
  </svg>
</div>

<!-- Age Category -->
<div class="relative">
  <label class="mr-1 font-semibold">Age Category</label>
  <select class="px-5 py-2.5 rounded-full bg-gray-200 text-gray-700 font-medium pr-10 focus:outline-none appearance-none">
    <option>Any</option>
    <option>Child 0-12</option>
    <option>Adult 13-64</option>
    <option>Senior 65+</option>
  </select>

  <!-- FIXED SVG -->
  <svg 
    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
    viewBox="0 0 20 20" fill="currentColor"
  >
    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
  </svg>
</div>

    <!-- RESET BUTTON -->
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
