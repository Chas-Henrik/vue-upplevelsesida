import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Booking } from '~/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<Booking[]>([])

  const isEmpty = computed(() => {
    return items.value.length === 0
  })
  
  const itemCount = computed(() => {
    return items.value.length
  })

  const addExcursion = (excursion: Booking) => {
    const existingIndex = items.value.findIndex(
      e => e.excursionId === excursion.excursionId && 
          e.date === excursion.date
    )
    
    // If the excursion with the same ID and dates exists, update it; otherwise, add new
    if (existingIndex !== -1) {
      items.value[existingIndex] = excursion
    } else {
      items.value.push(excursion)
    }
    items.value.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const removeExcursion = (excursionId: string, date: string) => {
    items.value = items.value.filter(
      exc => !(exc.excursionId === excursionId && exc.date === date)
    )
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    isEmpty,
    itemCount,
    addExcursion,
    removeExcursion,
    clearCart
  }
}, {
  persist: true
})
