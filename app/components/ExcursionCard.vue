<script setup lang="ts">
import type { Excursion } from '~/types'

interface Props {
  excursion: Excursion
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [buttonType: 'readMore' | 'book', excursionId: string]
}>()

const handleReadMore = () => {
  emit('click', 'readMore', props.excursion.id)
}

const handleBook = () => {
  emit('click', 'book', props.excursion.id)
}
</script>

<template>
  <div class="excursion-card">
    <div class="card-image">
      <NuxtImg 
        :src="`/data/images/excursionImages/${excursion.id}.png`" 
        :alt="excursion.title"
        class="image"
      />
      <div class="season-badge">{{ excursion.season }}</div>
    </div>
    
    <div class="card-content">
      <h3 class="card-title">{{ excursion.title }}</h3>
      <p class="card-description">{{ excursion.description }}</p>
      
      <div class="card-price">
        <span class="price-label">From</span>
        <span class="price-value">{{ excursion.prices.find(p => p.ageCategory === 'Adult 13-64')?.price }} SEK</span>
      </div>
      
      <div class="card-actions">
        <button 
          @click="handleReadMore" 
          class="btn btn-secondary"
        >
          Read More
        </button>
        <button 
          @click="handleBook" 
          class="btn btn-primary"
        >
          Book Now
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.excursion-card {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.excursion-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.excursion-card:hover .image {
  transform: scale(1.05);
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
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

.card-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  flex-grow: 1;
}

.card-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.price-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.price-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.btn-secondary {
  background: white;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-secondary:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary:active {
  transform: translateY(0);
}
</style>