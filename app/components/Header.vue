<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const isMobileMenuOpen = ref(false)

// Define menu items
const menuItems = [
  { id: 'home', label: 'Home', url: '/' }
]

const handleMenuClick = (url: string) => {
  navigateTo(url)
  isMobileMenuOpen.value = false // Close menu after navigation
}

const handleCartClick = () => {
  navigateTo('/cart')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo-section">
        <svg class="logo" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
          <!-- Mountain peaks -->
          <path d="M 20 40 L 35 15 L 50 40 Z" fill="var(--color-primary)" />
          <path d="M 40 40 L 55 20 L 70 40 Z" fill="var(--color-secondary)" />
          <path d="M 60 40 L 75 25 L 90 40 Z" fill="var(--color-accent)" />
          <!-- Sun -->
          <circle cx="25" cy="20" r="6" fill="#fbbf24" opacity="0.8" />
          <!-- Company text -->
          <text x="100" y="30" font-family="var(--font-serif)" font-size="18" font-weight="700" fill="var(--color-primary)">Adventure</text>
          <text x="100" y="48" font-family="var(--font-sans)" font-size="12" font-weight="500" fill="var(--color-text)">Excursions Inc.</text>
        </svg>
      </div>

      <!-- Navigation Menu -->
      <nav class="nav-menu" :class="{ 'nav-menu-open': isMobileMenuOpen }">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="handleMenuClick(item.url)"
          class="menu-btn"
        >
          {{ item.label }}
        </button>
      </nav>

      <!-- Shopping Cart -->
      <div class="cart-section">
        <button @click="handleCartClick" class="cart-btn" :aria-label="cartStore.isEmpty ? 'Empty cart' : `Cart with ${cartStore.itemCount} items`">
          <svg 
            v-if="cartStore.isEmpty"
            class="cart-icon"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,10c0,1.104,0.896,2,2,2h6.166L12,56.173c0,0.003,0,0.005,0,0.007c0,4.328,3.645,7.82,7.996,7.82
              c3.719,0,6.849-2.556,7.74-6h8.527c0.892,3.444,4.017,6,7.736,6c4.411,0,8-3.589,8-8s-3.589-8-8-8c-3.72,0-6.845,2.556-7.736,6
              h-8.527c-0.892-3.444-4.017-6-7.736-6c-1.696,0-3.268,0.534-4.563,1.438l-0.561-6.45C14.917,42.99,14.956,43,14.998,43
              c0.033,0,0.066-0.001,0.1-0.002l41-2c0.855-0.042,1.59-0.625,1.825-1.448l6-21c0.173-0.604,0.052-1.253-0.326-1.754
              S62.628,16,62,16H12.529l-0.537-6.173C11.902,8.793,11.037,8,10,8H2C0.896,8,0,8.896,0,10z M44,52c2.206,0,4,1.794,4,4
              s-1.794,4-4,4s-4-1.794-4-4S41.794,52,44,52z M20,52c2.206,0,4,1.794,4,4s-1.794,4-4,4s-4-1.794-4-4S17.794,52,20,52z M59.349,20
              l-4.878,17.072l-39.568,1.93c-0.127,0.006-0.249,0.027-0.368,0.056L12.877,20H59.349z"/>
          </svg>
          <svg 
            v-else
            class="cart-icon"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,10c0,1.104,0.896,2,2,2h6.166L12,56.173c0,0.003,0,0.005,0,0.007c0,4.328,3.645,7.82,7.996,7.82
              c3.719,0,6.849-2.556,7.74-6h8.527c0.892,3.444,4.017,6,7.736,6c4.411,0,8-3.589,8-8s-3.589-8-8-8c-3.72,0-6.845,2.556-7.736,6
              h-8.527c-0.892-3.444-4.017-6-7.736-6c-1.696,0-3.268,0.534-4.563,1.438l-0.561-6.45C14.917,42.99,14.956,43,14.998,43
              c0.033,0,0.066-0.001,0.1-0.002l41-2c0.855-0.042,1.59-0.625,1.825-1.448l6-21c0.173-0.604,0.052-1.253-0.326-1.754
              S62.628,16,62,16h-6.491L51.923,3.45C51.678,2.592,50.893,2,50,2H36c-0.53,0-1.039,0.211-1.414,0.586L29.172,8H20
              c-0.918,0-1.718,0.625-1.94,1.515L16.438,16h-3.909l-0.537-6.173C11.902,8.793,11.037,8,10,8H2C0.896,8,0,8.896,0,10z M44,52
              c2.206,0,4,1.794,4,4s-1.794,4-4,4s-4-1.794-4-4S41.794,52,44,52z M20,52c2.206,0,4,1.794,4,4s-1.794,4-4,4s-4-1.794-4-4
              S17.794,52,20,52z M36.828,6h11.663l2.857,10H33.562l-1.347-5.387L36.828,6z M21.562,12h6.877l1,4h-8.877L21.562,12z M53.993,20
              c0.002,0,0.004,0,0.006,0s0.005,0,0.007,0h5.343l-4.878,17.072l-39.568,1.93c-0.127,0.006-0.249,0.027-0.368,0.056L12.877,20
              H53.993z"/>
          </svg>
          <span v-if="!cartStore.isEmpty" class="cart-badge">{{ cartStore.itemCount }}</span>
        </button>
      </div>

      <!-- Hamburger Button (Mobile) -->
      <button @click="toggleMobileMenu" class="hamburger-btn" aria-label="Toggle menu">
        <svg class="hamburger-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path v-if="!isMobileMenuOpen" d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path v-else d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  position: relative;
}

.logo-section {
  flex-shrink: 0;
}

.logo {
  height: 60px;
  width: auto;
  cursor: default;
}

.hamburger-btn {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.hamburger-btn:hover {
  background: rgba(30, 58, 138, 0.05);
}

.hamburger-icon {
  width: 28px;
  height: 28px;
  color: var(--color-text);
}

.nav-menu {
  display: flex;
  gap: 1rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.menu-btn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  position: relative;
}

.menu-btn::after {
  content: '';
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width 0.2s ease;
}

.menu-btn:hover {
  color: var(--color-primary);
  background: rgba(30, 58, 138, 0.05);
}

.menu-btn:hover::after {
  width: 60%;
}

.cart-section {
  flex-shrink: 0;
}

.cart-btn {
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-btn:hover {
  background: rgba(30, 58, 138, 0.05);
  transform: scale(1.05);
}

.cart-icon {
  width: 32px;
  height: 32px;
  fill: var(--color-text);
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--color-accent);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  min-width: 20px;
  text-align: center;
  box-shadow: var(--shadow-sm);
}

@media (max-width: 768px) {
  .header-container {
    padding: 0.75rem 1rem;
    gap: 1rem;
  }

  .logo {
    height: 45px;
  }

  .hamburger-btn {
    display: block;
    order: 3;
  }

  .cart-section {
    order: 2;
    margin-left: auto;
  }

  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    gap: 0;
    padding: 0;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: var(--shadow-md);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    transform: none;
  }

  .nav-menu-open {
    max-height: 300px;
  }

  .menu-btn {
    padding: 1rem 1.5rem;
    font-size: 0.9375rem;
    text-align: left;
    border-radius: 0;
    width: 100%;
  }

  .menu-btn::after {
    display: none;
  }

  .menu-btn:hover {
    background: rgba(30, 58, 138, 0.05);
  }

  .cart-icon {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  .logo {
    height: 40px;
  }
}
</style>
