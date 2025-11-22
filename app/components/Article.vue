<script setup lang="ts">
import type { Article } from '~/types'

interface Props {
  article: Article
}

const props = defineProps<Props>()
</script>

<template>
  <div class="article-card">
    <div class="article-image">
      <NuxtImg 
        :src="`/data/images/excursionImages/${article.linkedExperienceId}.png`" 
        :alt="article.title"
        class="image"
      />
    </div>
    
    <div class="article-content">
      <h3 class="article-title">{{ article.title }}</h3>
      <p class="article-text">{{ article.content }}</p>
    </div>
  </div>
</template>

<style scoped>
.article-card {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: grid;
  grid-template-columns: 300px 1fr;
  height: 240px;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.article-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .image {
  transform: scale(1.05);
}

.article-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.article-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

.article-text {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .article-card {
    grid-template-columns: 1fr;
    height: auto;
  }

  .article-image {
    height: 200px;
  }

  .article-content {
    padding: 1.5rem;
  }

  .article-title {
    font-size: 1.25rem;
  }

  .article-text {
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
}
</style>