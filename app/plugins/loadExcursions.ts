export default defineNuxtPlugin(async () => {
  const { loadExcursions } = useExcursions()
  const { loadArticles } = useArticles()
  
  // Load excursions and articles data when app initializes
  await Promise.all([
    loadExcursions(),
    loadArticles()
  ])
})
