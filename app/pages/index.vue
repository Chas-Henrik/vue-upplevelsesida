<script setup lang="ts">
import type { AgeCategory } from '~/types/excursion'
import ExcursionFilter from '~/components/ExcursionFilter.vue'
import { useExcursions } from '~/composables/useExcursions'

const route = useRoute()
const { excursions, excursionsLoading, excursionsError, filterExcursions  } = useExcursions()
const { articles, articlesLoading, articlesError } = useArticles()

// Extract query params with validation (and silently ignore invalid ones)
const date = computed(() => {
  const value = route.query.date as string | undefined
  if (!value) return undefined
  const inputDate = new Date(value)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return inputDate >= today ? value : undefined
})

const duration = computed(() => {
  const value = route.query.duration as string | undefined
  if (!value) return undefined
  // Validate format: 'xh' (e.g., '4h') or 'x days' (e.g., '2 days')
  const validFormat = /^\d+h$|^\d+ days?$/.test(value)
  return validFormat ? value : undefined
})

const noPersons = computed(() => {
  const value = route.query['no-persons']
  const num = value ? Number(value) : undefined
  return num && num >= 1 && num <= 10 ? num : undefined
})

const ageCategory = computed(() => {
  const value = route.query['age-category'] as string
  const validCategories: AgeCategory[] = ['Child 0-12', 'Adult 13-64', 'Senior 65+']
  return validCategories.includes(value as AgeCategory) ? value as AgeCategory : undefined
})

const handleCardClick = (buttonType: 'readMore' | 'book', excursionId: string) => {
  // Build query params
  const queryParams = new URLSearchParams()
  
  if (date.value) queryParams.append('date', date.value)
  if (duration.value) queryParams.append('duration', duration.value)
  if (noPersons.value) queryParams.append('no-persons', noPersons.value.toString())
  if (ageCategory.value) queryParams.append('age-category', ageCategory.value)
  
  const queryString = queryParams.toString()
  
  if (buttonType === 'readMore') {
    const url = queryString ? `/excursion/${excursionId}?${queryString}` : `/excursion/${excursionId}`
    navigateTo(url)
  } else if (buttonType === 'book') {
    const url = queryString ? `/booking/${excursionId}?${queryString}` : `/booking/${excursionId}`
    navigateTo(url)
  }
}

// Filter
type FilterOptions = {
  date: string | null
  duration: string | null
  ageCategory: AgeCategory | null
  noPersons: number | null
}

const filters = ref<FilterOptions>({
  date: null,
  duration: null,
  ageCategory: null,
  noPersons: null
})

function applyFilters(newFilters: FilterOptions) {
  const query: any = {}

  if (newFilters.date) query.date = newFilters.date
  if (newFilters.duration) query.duration = newFilters.duration
  if (newFilters.noPersons) query['no-persons'] = newFilters.noPersons
  if (newFilters.ageCategory) query['age-category'] = newFilters.ageCategory

  navigateTo({ query }, { replace: true })
}


function resetFilter() {
  navigateTo('/', { replace: true })
}


// Final filtered excursions
const filteredExcursions = computed(() => {
  return filterExcursions({
    date: route.query.date as string | undefined,
    duration: route.query.duration as string | undefined,
    noPersons: route.query['no-persons']
      ? Number(route.query['no-persons'])
      : undefined,
    recommendedAge: route.query['age-category'] as any
  })
})

</script>

<template>
  <div class="home-page">
    <div class="container">

      <!-- Filters -->
      <ExcursionFilter @update:filters="applyFilters"
       @reset="resetFilter" />

      <!-- Loading -->
      <div v-if="excursionsLoading" class="loading-state">
        <p>Loading excursions...</p>
      </div>

      <!-- Error -->
      <div v-else-if="excursionsError" class="error-state">
        <p>{{ excursionsError }}</p>
      </div>

      <!-- LIST OF FILTERED EXCURSIONS -->
      <div v-else class="excursions-grid">
        <ExcursionCard 
          v-for="excursion in filteredExcursions"
          :key="excursion.id"
          :excursion="excursion"
          @click="handleCardClick"
        />
      </div>

      <!-- Articles -->
      <div class="articles-section">
        <h2 class="section-title">Articles</h2>
        
        <!-- Articles Loading state -->
        <div v-if="articlesLoading" class="loading-state">
          <p>Loading articles...</p>
        </div>

        <div v-else-if="articlesError" class="error-state">
          <p>{{ articlesError }}</p>
        </div>

        <div v-else class="articles-list">
          <Article 
            v-for="article in articles" 
            :key="article.id"
            :article="article"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;
}
.excursions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}
.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
}
.error-state {
  color: #dc2626;
}
.articles-section {
  margin-top: 4rem;
}
.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
}
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
