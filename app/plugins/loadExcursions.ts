export default defineNuxtPlugin(async () => {
  const { loadExcursions } = useExcursions()
  
  // Load excursions data when app initializes
  await loadExcursions()
})
