<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['update:filters'])

const filters = ref({
  season: '',
  priceSort: '',
  durationSort: ''
})

// Emit updated filters
function updateFilters() {
  emit('update:filters', { ...filters.value })
}

// Single dropdown controller:
const open = ref("")

function toggleMenu(type: string) {
  open.value = open.value === type ? "" : type
}

// Setters close the dropdown automatically
function setSeason(v: string) {
  filters.value.season = v
  updateFilters()
  open.value = ""
}

function setPrice(v: string) {
  filters.value.priceSort = v
  updateFilters()
  open.value = ""
}

function setDuration(v: string) {
  filters.value.durationSort = v
  updateFilters()
  open.value = ""
}
</script>

<template>
  <div class="flex flex-wrap gap-4 mb-8">

    <!-- SEASON -->
    <div class="relative">
      <button
        @click="toggleMenu('season')"
        class="px-6 py-2 bg-gray-100 rounded-xl text-center font-semibold text-gray-700 shadow-sm hover:bg-gray-200 transition"
      >
        {{ filters.season || 'Season' }}
      </button>

      <div
        v-if="open === 'season'"
        class="absolute mt-2 bg-gray-100 rounded-xl shadow-lg w-44 py-2 flex flex-col z-50 border border-gray-200"
      >
        <button @click="setSeason('Winter')" class="px-4 py-2 text-left text-gray-700 hover:bg-gray-200 rounded-md transition">
          Winter
        </button>
        <button @click="setSeason('Summer')" class="px-4 py-2 text-left text-gray-700 hover:bg-gray-200 rounded-md transition">
          Summer
        </button>
        <button @click="setSeason('')" class="px-4 py-2 text-left text-red-500 hover:bg-gray-200 rounded-md transition">
          Clear
        </button>
      </div>
    </div>

    <!-- PRICE -->
    <div class="relative">
      <button
        @click="toggleMenu('price')"
        class="px-6 py-2 bg-gray-100 rounded-xl text-center font-semibold text-gray-700 shadow-sm hover:bg-gray-200 transition"
      >
        {{ filters.priceSort || 'Price' }}
      </button>

      <div
        v-if="open === 'price'"
        class="absolute mt-2 bg-gray-100 rounded-xl shadow-lg w-48 py-2 flex flex-col z-50 border border-gray-200"
      >
        <button @click="setPrice('High')" class="px-4 py-2 text-left text-gray-700 hover:bg-gray-200 rounded-md transition">
          High → Low
        </button>
        <button @click="setPrice('Low')" class="px-4 py-2 text-left text-gray-700 hover:bg-gray-200 rounded-md transition">
          Low → High
        </button>
        <button @click="setPrice('')" class="px-4 py-2 text-left text-red-500 hover:bg-gray-200 rounded-md transition">
          Clear
        </button>
      </div>
    </div>

    <!-- DURATION -->
    <div class="relative">
      <button
        @click="toggleMenu('duration')"
        class="px-6 py-2 bg-gray-100 rounded-xl text-center font-semibold text-gray-700 shadow-sm hover:bg-gray-200 transition"
      >
        {{ filters.durationSort || 'Duration' }}
      </button>

      <div
        v-if="open === 'duration'"
        class="absolute mt-2 bg-gray-100 rounded-xl shadow-lg w-48 py-2 flex flex-col z-50 border border-gray-200"
      >
        <button @click="setDuration('Long')" class="px-4 py-2 text-left text-gray-700 hover:bg-gray-200 rounded-md transition">
          Long → Short
        </button>
        <button @click="setDuration('Short')" class="px-4 py-2 text-left text-gray-700 hover:bg-gray-200 rounded-md transition">
          Short → Long
        </button>
        <button @click="setDuration('')" class="px-4 py-2 text-left text-red-500 hover:bg-gray-200 rounded-md transition">
          Clear
        </button>
      </div>
    </div>

  </div>
</template>
