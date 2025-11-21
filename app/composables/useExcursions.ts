import { ref, readonly } from 'vue'
import type { Excursion } from '~/types/excursion'

interface ExcursionData {
  excursion: Excursion[]
}

const excursions = ref<Excursion[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export const useExcursions = () => {
  const loadExcursions = async () => {
    // Return cached data if already loaded
    if (excursions.value.length > 0) {
      return excursions.value
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch('/data/jsonData/excursion.json')
      
      if (!response.ok) {
        throw new Error(`Failed to load excursions: ${response.statusText}`)
      }

      const data: ExcursionData = await response.json()
      excursions.value = data.excursion
      
      return excursions.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load excursions'
      console.error('Error loading excursions:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getExcursionById = (id: string) => {
    return excursions.value.find(excursion => excursion.id === id)
  }

  const getExcursionsBySeason = (season: 'Winter' | 'Summer') => {
    return excursions.value.filter(excursion => excursion.season === season)
  }

  return {
    excursions: readonly(excursions),
    loading: readonly(loading),
    error: readonly(error),
    loadExcursions,
    getExcursionById,
    getExcursionsBySeason
  }
}
