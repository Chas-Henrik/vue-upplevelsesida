<script setup lang="ts">
const { excursions, excursionsLoading, excursionsError } = useExcursions()
const { articles, articlesLoading, articlesError } = useArticles()

const handleCardClick = (buttonType: 'readMore' | 'book', excursionId: string) => {
  if (buttonType === 'readMore') {
    navigateTo(`/excursion/${excursionId}`)
  } else if (buttonType === 'book') {
    navigateTo(`/booking/${excursionId}`)
  }
}
</script>

<template>
  <div class="home-page">

    <div class="container">
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
          v-for="excursion in excursions" 
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
  padding: 0 2rem 4rem;
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