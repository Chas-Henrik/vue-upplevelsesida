<script setup lang="ts">
const route = useRoute()
const { getExcursionById } = useExcursions()

const excursionId = route.params.id as string
const excursion = computed(() => getExcursionById(excursionId))

const handleBook = () => {
  navigateTo(`/booking/${excursionId}`)
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
        <div class="price-badge">
          <div class="price-badge-label">From:</div>
          <div class="price-badge-value">{{ excursion.price }} SEK</div>
        </div>
        <div class="hero-overlay">
          <div class="hero-content">
            <h1 class="hero-title">{{ excursion.title }}</h1>
            <p class="hero-info"><strong>Recommended for:</strong> {{ excursion.ageCategory }}</p>
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

          <!-- Packages -->
          <div v-if="excursion.packages.length > 0" class="packages-section">
            <h2>Available Add-ons</h2>
            <div class="packages-list">
              <div 
                v-for="pkg in excursion.packages" 
                :key="pkg.id"
                class="package-item"
              >
                <span class="package-title"><strong>{{ pkg.title }}</strong></span>
                <span class="package-price">+{{ pkg.price }} SEK</span>
              </div>
            </div>
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
  margin: 4rem auto;
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

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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
.packages-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 1rem 0;
}

.packages-section h2 {
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

.packages-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
}

.package-item {
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

.package-title {
  font-weight: 500;
  color: var(--color-text);
}

.package-price {
  font-weight: 600;
  color: var(--color-primary);
}

.packages-section {
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

  .hero-content {
    padding: 2rem 1.5rem;
  }

  .content-container {
    padding: 2rem 1rem;
  }

  .description-section h2,
  .description-section h3,
  .info-section h2,
  .packages-section h2 {
    font-size: 1.5rem;
  }

  .btn-large {
    width: 100%;
    padding: 1rem 2rem;
  }
}
</style>