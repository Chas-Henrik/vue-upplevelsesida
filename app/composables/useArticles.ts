import { ref, readonly } from 'vue'
import type { Article, ArticleFilters } from '~/types'

interface ArticleData {
  articles: Article[]
}

const articles = ref<Article[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export const useArticles = () => {
  const loadArticles = async () => {
    // Return cached data if already loaded
    if (articles.value.length > 0) {
      return articles.value
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch('/data/jsonData/article.json')
      
      if (!response.ok) {
        throw new Error(`Failed to load articles: ${response.statusText}`)
      }

      const data: ArticleData = await response.json()
      articles.value = data.articles
      
      return articles.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load articles'
      console.error('Error loading articles:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getArticleById = (id: string) => {
    return articles.value.find(article => article.id === id)
  }

  const getArticlesByExperienceId = (experienceId: string) => {
    return articles.value.filter(article => article.linkedExperienceId === experienceId)
  }

  const filterArticles = (filters: ArticleFilters) => {
    return articles.value.filter(article => {
      const matchesSeason = !filters.season || article.season === filters.season
      const matchesAgeCategory = !filters.ageCategory || article.ageCategory === filters.ageCategory
      return matchesSeason && matchesAgeCategory
    })
  }

  return {
    articles: readonly(articles),
    articlesLoading: readonly(loading),
    articlesError: readonly(error),
    loadArticles,
    getArticleById,
    getArticlesByExperienceId,
    filterArticles
  }
}
