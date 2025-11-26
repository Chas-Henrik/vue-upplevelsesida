<script setup lang="ts">
import type { AgeCategory } from '~/types/excursion'
import ExcursionFilter from '~/components/ExcursionFilter.vue'

const route = useRoute()
const { excursions, excursionsLoading, excursionsError } = useExcursions()
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

type FilterOptions = {
  season: string;
  priceSort: string;
  durationSort: string;
}


const filters = ref<FilterOptions>({
  season: '',
  priceSort: '',
  durationSort: ''
})

// Ta emot filters från child
function applyFilters(newFilters: FilterOptions) {
  filters.value = newFilters
}

// Konvertera duration till timmar
function durationToHours(duration: string) {
  if (!duration) return 0
  if (duration.endsWith("h")) return parseInt(duration)
  if (duration.includes("day")) return parseInt(duration) * 24
  return 0
}

// Hämta adult price som standard för sortering
function getAdultPrice(exc: any) {
  const adult = exc.prices.find((p: any) => p.ageCategory === "Adult 13-64")
  return adult ? adult.price : 0
}

// Filtrera och sortera excursions
const filteredExcursions = computed(() => {
  if (!excursions.value) return []

  let list = [...excursions.value]

  if (filters.value.season) {
    list = list.filter(exc => exc.season === filters.value.season)
  }

  if (filters.value.priceSort === "high") {
    list.sort((a, b) => getAdultPrice(b) - getAdultPrice(a))
  }

  if (filters.value.priceSort === "low") {
    list.sort((a, b) => getAdultPrice(a) - getAdultPrice(b))
  }

  if (filters.value.durationSort === "long") {
    list.sort((a, b) => durationToHours(b.duration) - durationToHours(a.duration))
  }

  if (filters.value.durationSort === "short") {
    list.sort((a, b) => durationToHours(a.duration) - durationToHours(b.duration))
  }
  
  return list
})
</script>


<template>
  <div class="home-page">
    <div class="container">
      <!-- filter component -->
      <ExcursionFilter @update:filters="applyFilters" />

      <!-- Loading state -->
      <div v-if="excursionsLoading" class="loading-state">
        <p>Loading excursions...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="excursionsError" class="error-state">
        <p>{{ excursionsError }}</p>
      </div>

      <!-- Excursions grid -->
      <div v-else class="excursions-grid">
        <ExcursionCard 
          v-for="excursion in filteredExcursions" 
          :key="excursion.id"
          :excursion="excursion"
          @click="handleCardClick"
        />
      </div>

      <!-- Articles Section -->
      <div class="articles-section">
        <h2 class="section-title">Articles</h2>
        
        <!-- Articles Loading state -->
        <div v-if="articlesLoading" class="loading-state">
          <p>Loading articles...</p>
        </div>

        <!-- Articles Error state -->
        <div v-else-if="articlesError" class="error-state">
          <p>{{ articlesError }}</p>
        </div>

        <!-- Articles list -->
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

.hero {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  margin-bottom: 3rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
  margin: 0;
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
  font-size: 1.125rem;
}

.error-state {
  color: #dc2626;
}

.articles-section {
  margin-top: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 2rem 0;
  text-align: center;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .excursions-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>
