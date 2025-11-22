import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '~/types/cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const isEmpty = computed(() => {
    return items.value.length === 0
  })
  
  const itemCount = computed(() => {
    return items.value.length
  })

  const addExcursion = (excursion: CartItem) => {
    const existingIndex = items.value.findIndex(
      e => e.excursionId === excursion.excursionId && 
          e.startDate === excursion.startDate && 
          e.endDate === excursion.endDate
    )
    
    // If the excursion with the same ID and dates exists, update it; otherwise, add new
    if (existingIndex !== -1) {
      items.value[existingIndex] = excursion
    } else {
      items.value.push(excursion)
    }
  }

  const removeExcursion = (excursionId: string, startDate: string) => {
    items.value = items.value.filter(
      exc => !(exc.excursionId === excursionId && exc.startDate === startDate)
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
})
