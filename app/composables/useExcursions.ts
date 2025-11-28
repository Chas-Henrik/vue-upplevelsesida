import { ref, readonly } from 'vue'
import type { Excursion, ExcursionFilters } from '~/types'

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

  const filterExcursions = (filters: ExcursionFilters) => {
    return excursions.value.filter(excursion => {
      // Determine season from date
      let matchesSeason = true
      if (filters.date) {
        const date = new Date(filters.date)
        const month = date.getMonth() + 1 // getMonth() returns 0-11
        // April (4) to September (9) = Summer, October (10) to March (3) = Winter
        const seasonFromDate = (month >= 4 && month <= 9) ? 'Summer' : 'Winter'
        matchesSeason = excursion.season === seasonFromDate
      }
      const matchesRecommendedAge = !filters.recommendedAge || excursion.recommendedAge === filters.recommendedAge
      const matchesDuration = !filters.duration || excursion.duration === filters.duration
      const matchesNoPersons = !filters.noPersons || excursion.maxGroupSize >= filters.noPersons
      return matchesSeason && matchesRecommendedAge && matchesDuration && matchesNoPersons
    })
  }

  const getSortedExcursionDurations = () => {
    return [...new Set(excursions.value.map(e => e.duration))]
      .sort((a, b) => {
        const aIsDay = a.includes("day")
        const bIsDay = b.includes("day")
  
        if (aIsDay && !bIsDay) return 1
        if (!aIsDay && bIsDay) return -1
  
        return parseInt(a) - parseInt(b)
      })
  }

  const getExcursionDurations = () => {
    const durations = excursions.value.map(excursion => excursion.duration)
    return [...new Set(durations)].sort()
  }

  return {
    excursions: readonly(excursions),
    excursionsLoading: readonly(loading),
    excursionsError: readonly(error),
    loadExcursions,
    getExcursionById,
    filterExcursions,
    getExcursionDurations,
    getSortedExcursionDurations
  }
}
