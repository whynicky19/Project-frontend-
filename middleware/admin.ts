export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  authStore.init()
  if (!authStore.isAuthenticated) return navigateTo('/login')
  if (!authStore.isAdmin) return navigateTo('/dashboard')
})
