<script setup lang="ts">
import type { AgeCategory } from '~/types/excursion'

const route = useRoute()
const { getExcursionById } = useExcursions()

const excursionId = route.params.id as string
const excursion = computed(() => getExcursionById(excursionId))

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

const handleBook = () => {
  // Build query params
  const queryParams = new URLSearchParams()
  
  if (date.value) queryParams.append('date', date.value)
  if (duration.value) queryParams.append('duration', duration.value)
  if (noPersons.value) queryParams.append('no-persons', noPersons.value.toString())
  if (ageCategory.value) queryParams.append('age-category', ageCategory.value)
  
  const queryString = queryParams.toString()
  const url = queryString ? `/booking/${excursionId}?${queryString}` : `/booking/${excursionId}`
  
  navigateTo(url)
}
</script>

<template>
  <div class="excursion-page">
    <!-- Show error if excursion not found -->
    <div v-if="!excursion" class="error-container">
      <h1>Excursion Not Found</h1>
      <p>The excursion you're looking for doesn't exist.</p>
      <button @click="navigateTo('/')" class="btn btn-primary">
        Back to Home
      </button>
    </div>

    <!-- Show excursion details -->
    <div v-else class="excursion-container">
      <!-- Hero Image -->
      <div class="excursion-hero">
        <NuxtImg 
          :src="`/data/images/excursionImages/${excursion.id}.png`" 
          :alt="excursion.title"
          class="hero-image"
        />
        <div class="season-badge">{{ excursion.season }}</div>
        <div class="duration-badge">⏱️ {{ excursion.duration }}</div>
        <div class="price-badge">
          <div class="price-badge-label">From:</div>
          <div class="price-badge-value">{{ excursion.prices.find(p => p.ageCategory === 'Adult 13-64')?.price }} SEK</div>
        </div>
        <div class="hero-overlay">
          <div class="hero-content">
            <h1 class="hero-title">{{ excursion.title }}</h1>
            <div class="hero-info-row">
              <p class="hero-info"><strong>Recommended for:</strong> {{ excursion.recommendedAge }}</p>
              <p class="hero-info"><strong>Max Group Size:</strong> {{ excursion.maxGroupSize }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="content-container">
        <div class="content-wrapper">
          <!-- Description & Details Section -->
          <div class="description-section">
            <h2>Description</h2>
            <p class="description-text">{{ excursion.description }}</p>
            <p class="details-label"><strong>Details</strong></p>
            <p class="details-text">{{ excursion.details }}</p>
          </div>

          <!-- Offers -->
          <div v-if="excursion.offers.length > 0" class="offers-section">
            <h2>Available Add-ons</h2>
            <div class="offers-list">
              <div 
                v-for="offer in excursion.offers" 
                :key="offer.id"
                class="offer-item"
              >
                <span class="offer-title"><strong>{{ offer.title }}</strong></span>
                <span class="offer-price">+{{ offer.price }} SEK</span>
              </div>
            </div>
          </div>

          <!-- Selected Filters (Soft Tags) -->
          <div 
            v-if="date || duration || ageCategory || noPersons"
            class="flex flex-wrap gap-2 mb-6 items-center"
          >
            <span v-if="date" class="soft-tag">
              📅 {{ date }}
            </span>

            <span v-if="duration" class="soft-tag">
              ⏱️ {{ duration }}
            </span>

            <span v-if="ageCategory" class="soft-tag">
              👤 {{ ageCategory }}
            </span>

            <span v-if="noPersons" class="soft-tag">
              👥 {{ noPersons }} persons
            </span>
          </div>


          <!-- Book Button -->
          <div class="book-section">
            <button @click="handleBook" class="btn btn-primary btn-large">
              Book This Excursion
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.excursion-page {
  min-height: 100vh;
}

.error-container {
  max-width: 600px;
  margin: 2rem auto 2rem;
  padding: 2rem;
  text-align: center;
}

.error-container h1 {
  font-size: 2rem;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.error-container p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.excursion-container {
  width: 100%;
}

.excursion-hero {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}

.hero-content {
  max-width: 1200px;
  padding: 1rem;
  position: relative;
}

.season-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: var(--shadow-sm);
  z-index: 10;
}

.price-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--color-accent);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 1rem;
  box-shadow: var(--shadow-md);
  z-index: 10;
  text-align: center;
  line-height: 1.2;
}

.price-badge-label {
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.9;
}

.price-badge-value {
  font-size: 1.125rem;
  font-weight: 700;
}

.duration-badge {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-primary);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  z-index: 10;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-info-row {
  display: flex;
  column-gap: 1rem;
  flex-wrap: wrap;
}

.hero-info {
  font-size: 1rem;
  color: white;
  margin: 0;
  line-height: 1.6;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  opacity: 0.95;
  max-width: 800px;
}

.content-container {
  background: var(--color-bg);
  padding: 4rem 2rem;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.description-section {
  background: white;
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.description-section h2,
.description-section h3,
.info-section h2,
.offers-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 1rem 0;
}

.offers-section h2 {
  text-align: center;
}

.description-section h3 {
  font-size: 1.5rem;
  margin-top: 2rem;
}

.description-text,
.details-text,
.info-text {
  color: #374151;
  line-height: 1.8;
  font-size: 1.0625rem;
  margin: 0;
}

.details-label {
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  font-size: 1.0625rem;
}

.offers-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
}

.offer-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid #e5e7eb;
  flex: 1 1 calc(33.333% - 1rem);
  min-width: 150px;
  text-align: center;
  gap: 0.5rem;
}

.offer-title {
  font-weight: 500;
  color: var(--color-text);
}

.offer-price {
  font-weight: 600;
  color: var(--color-primary);
}

.offers-section {
  background: white;
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.book-section {
  text-align: center;
  margin-top: 3rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-align: center;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: #1e40af;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-large {
  padding: 1rem 3rem;
  font-size: 1.125rem;
}

.soft-tag {
  background: #f1f1f1;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #333;
  border: 1px solid #e0e0e0;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 4px;

}

@media (max-width: 768px) {
  .excursion-hero {
    height: 350px;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-info {
    font-size: 0.75rem;
  }

  .hero-info-row {
    row-gap: 0rem;
    column-gap: 0.5rem
  }

  .hero-content {
    padding: 2rem 1.5rem;
  }

  .content-container {
    padding: 2rem 1rem;
  }

  .description-section h2,
  .description-section h3,
  .info-section h2,
  .offers-section h2 {
    font-size: 1.5rem;
  }

  .btn-large {
    width: 100%;
    padding: 1rem 2rem;
  }
}
</style>